import { Router } from 'express';
import { pool } from '../db';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// GET /api/volunteers
router.get('/volunteers', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM volunteers');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/resources
router.get('/resources', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM resources');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notifications (authenticated)
router.get('/notifications', authenticateToken, async (req: any, res: any) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/operations
router.get('/operations', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rescue_operations');
    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
