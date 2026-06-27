# CiviFix Architecture

## High-Level Overview
CiviFix is a modern, real-time civic engagement and emergency response platform. It utilizes a monolithic architecture bridging a React frontend and an Express/Node.js backend, powered by PostgreSQL and Socket.io.

## Technology Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Framer Motion, React-Leaflet.
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (pg).
- **Real-time**: Socket.io.
- **AI Integration**: Google Gemini (via `@google/genai`).

## Core Modules
1. **Authentication (JWT)**
   - Role-Based Access Control (Roles: `citizen`, `volunteer`, `coordinator`, `admin`).
2. **Incident Management**
   - RESTful API for CRUD operations on incidents.
   - Real-time broadcasts (`new_issue`) to all connected clients when an issue is reported.
3. **AI Prioritization & Forensics**
   - Automatically analyzes citizen descriptions to deduce severity, category, and department.
   - Provides verification scans to prevent duplicate or fraudulent reports.
4. **Smart Resource Allocation**
   - `/api/issues/:id/allocate` intelligently dispatches available volunteers and resources.
5. **Real-Time Interactive Map**
   - `react-leaflet` mapping interface to visualize live incidents and safe zones.
6. **Gamification & Reputation**
   - Users earn reputation points for verifying reports and completing civic actions.
