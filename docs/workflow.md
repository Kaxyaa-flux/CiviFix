# CiviFix Operations Workflow

## 1. Incident Reporting (Citizen Workflow)
1. A user authenticates via the `/api/login` endpoint.
2. The user navigates to the **Report** page and fills in the issue details.
3. Upon submission, the frontend calls the AI endpoint (`/api/analyze-issue`) for preliminary severity and category suggestions.
4. The user confirms the AI analysis and submits the form via `POST /api/issues`.
5. The backend inserts the incident into the PostgreSQL `incidents` table and optionally generates an `emergency_reports` entry.
6. **Real-time trigger:** The backend emits a `new_issue` Socket.io event to all connected clients.

## 2. Real-Time Tracking & Verification
1. Connected dashboards instantly receive the new incident and display a toast notification.
2. The incident appears as a marker on the Interactive Emergency Map.
3. Other users (or admins) can verify the incident using the AI Forensic feature (`/api/verify-issue`) to check for fraud/duplicates.

## 3. Resource Allocation & Resolution
1. Once an incident is verified or prioritized, the system invokes `/api/issues/:id/allocate`.
2. The backend queries available `volunteers` and `resources` matching the incident's category.
3. A `rescue_operations` record is created, marking the incident response as 'active'.
4. Volunteers are dispatched, and upon completion, the status is updated to 'resolved', triggering reputation points updates for involved users.
