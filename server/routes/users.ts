import { Router } from 'express';
import { pool } from '../db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// PATCH /api/users/:id/points
router.patch('/:id/points', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { points } = req.body;

    // Users may only update their own points
    if (req.user.id !== id) return res.sendStatus(403);

    const result = await pool.query(
      'UPDATE users SET reputation_points = $1 WHERE id = $2 RETURNING *',
      [points, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const dbUser = result.rows[0];
    res.json({
      id: dbUser.id,
      email: dbUser.email,
      fullName: dbUser.full_name,
      role: dbUser.role,
      reputationPoints: dbUser.reputation_points,
      joinedAt: dbUser.joined_at,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
