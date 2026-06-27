# CiviFix Database Schema

The platform relies on a normalized PostgreSQL database to handle robust reporting, allocation, and authentication.

## Core Tables

### 1. `users`
- `id` (UUID, PK)
- `email` (VARCHAR, Unique)
- `password_hash` (VARCHAR)
- `full_name` (VARCHAR)
- `role` (VARCHAR) - e.g., 'citizen', 'volunteer', 'admin'
- `reputation_points` (INTEGER)
- `joined_at` (TIMESTAMP)

### 2. `volunteers`
- `id` (UUID, PK)
- `user_id` (UUID, FK -> users)
- `skills` (TEXT)
- `availability_status` (VARCHAR)
- `last_known_location` (TEXT)

### 3. `incidents`
- `id` (VARCHAR, PK) - Custom ID like 'INC-1234'
- `title` (VARCHAR)
- `description` (TEXT)
- `category` (VARCHAR)
- `status` (VARCHAR)
- `severity` (INTEGER)
- `location_name` (VARCHAR)
- `coord_lat` (NUMERIC)
- `coord_lng` (NUMERIC)
- `reporter_id` (UUID, FK -> users)
- `created_at` (TIMESTAMP)
- `upvotes` (INTEGER)

### 4. `emergency_reports`
- Tracks individual user submissions for a specific incident.
- `incident_id` (VARCHAR, FK -> incidents)
- `reporter_id` (UUID, FK -> users)
- `details` (TEXT)

### 5. `resources`
- `name` (VARCHAR)
- `type` (VARCHAR) - e.g., 'vehicle', 'medical', 'pump'
- `quantity` (INTEGER)
- `status` (VARCHAR) - e.g., 'available', 'deployed'

### 6. `rescue_operations`
- Ties incidents to real-world allocations and resolutions.
- `incident_id` (VARCHAR, FK -> incidents)
- `status` (VARCHAR)
- `started_at` (TIMESTAMP)
- `resolved_at` (TIMESTAMP)

### 7. `notifications`
- `user_id` (UUID, FK -> users)
- `title`, `message`, `type`, `read`
