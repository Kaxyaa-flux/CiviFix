import { Router } from 'express';
import type { Server } from 'socket.io';
import type { Multer } from 'multer';
import { pool } from '../db';
import { authenticateToken } from '../middleware/auth';

// io is injected by server.ts after Socket.io is initialized
let _io: Server | null = null;
export function setIo(io: Server) {
  _io = io;
}

// upload is injected by server.ts after multer is configured
let _upload: Multer | null = null;
export function setUpload(upload: Multer) {
  _upload = upload;
}

const router = Router();

// GET /api/stats — included here as it's closely coupled to issue counts
router.get('/stats', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT issues_reported, issues_resolved, active_volunteers, impact_score FROM stats WHERE id = 1'
    );
    if (result.rows.length > 0) {
      res.json({
        issuesReported: result.rows[0].issues_reported,
        issuesResolved: result.rows[0].issues_resolved,
        activeVolunteers: result.rows[0].active_volunteers,
        impactScore: result.rows[0].impact_score,
      });
    } else {
      res.json({ issuesReported: 0, issuesResolved: 0, activeVolunteers: 0, impactScore: 0 });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/issues
router.get('/', async (_req, res) => {
  try {
    const issuesResult = await pool.query('SELECT * FROM incidents ORDER BY upvotes DESC');
    const timelineResult = await pool.query('SELECT * FROM incident_timeline');

    const issues = issuesResult.rows.map(issue => {
      const timeline = timelineResult.rows
        .filter(t => t.incident_id === issue.id)
        .map(t => ({
          status: t.status,
          label: t.label,
          date: t.date,
          completed: t.completed,
        }));

      return {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        category: issue.category,
        priority: issue.priority,
        status: issue.status,
        locationName: issue.location_name,
        coordinates: { lat: issue.coord_x, lng: issue.coord_y },
        reportedAt: issue.reported_at,
        upvotes: issue.upvotes,
        reporterName: issue.reporter_name,
        imageUrls: issue.image_urls ? JSON.parse(issue.image_urls) : [],
        timeline,
      };
    });

    res.json(issues);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/issues (with image upload)
router.post('/', authenticateToken, (req: any, res: any, next: any) => {
  if (!_upload) return res.status(500).json({ error: 'Upload middleware not initialized' });
  _upload.array('images', 3)(req, res, next);
}, async (req: any, res: any) => {
  try {
    const { id, title, description, category, priority, status, locationName, reportedAt, reporterName } = req.body;
    const coordinates = typeof req.body.coordinates === 'string'
      ? JSON.parse(req.body.coordinates)
      : req.body.coordinates;
    const timeline = typeof req.body.timeline === 'string'
      ? JSON.parse(req.body.timeline)
      : req.body.timeline;
    const upvotes = 0;
    const userId = req.user.id;

    const imageUrls = req.files && req.files.length > 0
      ? req.files.map((file: any) => `/uploads/${file.filename}`)
      : [];
    const imageUrlsStr = JSON.stringify(imageUrls);

    await pool.query(
      'INSERT INTO incidents (id, title, description, category, priority, status, location_name, coord_x, coord_y, reported_at, upvotes, reporter_name, user_id, image_urls) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
      [id, title, description, category, priority, status, locationName, coordinates.lat, coordinates.lng, reportedAt, upvotes, reporterName, userId, imageUrlsStr]
    );

    if (timeline && timeline.length > 0) {
      for (const t of timeline) {
        await pool.query(
          'INSERT INTO incident_timeline (incident_id, status, label, date, completed) VALUES ($1, $2, $3, $4, $5)',
          [id, t.status, t.label, t.date, t.completed]
        );
      }
    }

    await pool.query('UPDATE stats SET issues_reported = issues_reported + 1 WHERE id = 1');

    if (_io) {
      _io.emit('new_issue', req.body);
    }

    res.status(201).json({ message: 'Issue created' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/issues/:id/upvote
router.patch('/:id/upvote', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'UPDATE incidents SET upvotes = upvotes + 1 WHERE id = $1 RETURNING upvotes',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Issue not found' });
    res.json({ upvotes: result.rows[0].upvotes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/issues/:id/allocate
router.post('/:id/allocate', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const incidentRes = await pool.query('SELECT * FROM incidents WHERE id = $1', [id]);
    if (incidentRes.rows.length === 0) return res.status(404).json({ error: 'Incident not found' });
    const incident = incidentRes.rows[0];

    const volunteersRes = await pool.query(
      "SELECT * FROM volunteers WHERE availability_status = 'available' LIMIT 3"
    );
    const allocatedVolunteers = volunteersRes.rows;

    let resourceKeyword = 'vehicle';
    if (incident.category === 'Health') resourceKeyword = 'medical';
    if (incident.category === 'Water & Utilities') resourceKeyword = 'pump';
    if (incident.category === 'Road Safety & Forestry') resourceKeyword = 'saw';

    const resourcesRes = await pool.query(
      "SELECT * FROM resources WHERE status = 'available' AND type ILIKE $1 LIMIT 2",
      [`%${resourceKeyword}%`]
    );
    let allocatedResources = resourcesRes.rows;
    if (allocatedResources.length === 0) {
      const anyResources = await pool.query("SELECT * FROM resources WHERE status = 'available' LIMIT 2");
      allocatedResources = anyResources.rows;
    }

    const opRes = await pool.query(
      "INSERT INTO rescue_operations (incident_id, status) VALUES ($1, 'active') RETURNING *",
      [id]
    );

    res.json({
      operation: opRes.rows[0],
      allocatedVolunteers,
      allocatedResources,
      message: 'Smart allocation successful.',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
