import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function setupDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'citizen',
      reputation_points INTEGER DEFAULT 0,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS volunteers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      skills TEXT[],
      availability_status VARCHAR(50) DEFAULT 'available',
      current_location_x NUMERIC,
      current_location_y NUMERIC,
      rating FLOAT DEFAULT 5.0
    );

    CREATE TABLE IF NOT EXISTS incidents (
      id VARCHAR(50) PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category VARCHAR(100) NOT NULL,
      priority VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      location_name TEXT NOT NULL,
      coord_x NUMERIC NOT NULL,
      coord_y NUMERIC NOT NULL,
      reported_at VARCHAR(100),
      upvotes INTEGER DEFAULT 0,
      reporter_name VARCHAR(255) NOT NULL,
      user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      ai_confidence INTEGER,
      ai_department VARCHAR(100)
    );

    CREATE TABLE IF NOT EXISTS emergency_reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      incident_id VARCHAR(50) REFERENCES incidents(id) ON DELETE CASCADE,
      reporter_id UUID REFERENCES users(id),
      details TEXT,
      reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS resources (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      type VARCHAR(100) NOT NULL,
      quantity INTEGER DEFAULT 1,
      location_name TEXT,
      coord_x NUMERIC,
      coord_y NUMERIC,
      status VARCHAR(50) DEFAULT 'available'
    );

    CREATE TABLE IF NOT EXISTS rescue_operations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      incident_id VARCHAR(50) REFERENCES incidents(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'active',
      started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      resolved_at TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type VARCHAR(50) NOT NULL,
      read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS incident_timeline (
      id SERIAL PRIMARY KEY,
      incident_id VARCHAR(50) REFERENCES incidents(id) ON DELETE CASCADE,
      status VARCHAR(50) NOT NULL,
      label VARCHAR(255) NOT NULL,
      date VARCHAR(100) NOT NULL,
      completed BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS stats (
      id INTEGER PRIMARY KEY,
      issues_reported INTEGER DEFAULT 14258,
      issues_resolved INTEGER DEFAULT 12891,
      active_volunteers INTEGER DEFAULT 4320,
      impact_score FLOAT DEFAULT 98.4
    );

    INSERT INTO stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
  `);

  // Retroactively add image_urls to incidents if it doesn't exist
  await pool.query(`ALTER TABLE incidents ADD COLUMN IF NOT EXISTS image_urls TEXT;`);
  console.log('Database tables initialized.');
}
