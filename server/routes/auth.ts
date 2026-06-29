import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db';

const router = Router();

/** Shape a DB row into the API user object consistently. */
function dbRowToUser(row: any) {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    avatar: row.avatar || 'av1',
    role: row.role,
    reputationPoints: row.reputation_points,
    joinedAt: row.joined_at,
  };
}

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, role, avatar } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, role, reputation_points, avatar) VALUES ($1, $2, $3, $4, 0, $5) RETURNING id, email, full_name, role, reputation_points, joined_at, avatar',
      [email, hashedPassword, fullName, role || 'citizen', avatar || 'av1']
    );
    const user = dbRowToUser(result.rows[0]);
    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.fullName },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    res.json({ user, token });
  } catch (error: any) {
    if (error.code === '23505') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// POST /api/auth/signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: 'Invalid credentials' });

    const dbUser = result.rows[0];
    const valid = await bcrypt.compare(password, dbUser.password_hash);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const user = dbRowToUser(dbUser);
    const token = jwt.sign(
      { id: user.id, email: user.email, fullName: user.fullName },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );
    res.json({ user, token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
