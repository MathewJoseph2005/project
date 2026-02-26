# Pac-Man Game with User Authentication

A full-stack application featuring user authentication, admin dashboard, and a playable Pac-Man game.

## Features

- User registration and login
- JWT-based authentication
- Admin dashboard with user management
- Real-time user status tracking
- Playable Pac-Man game
- MongoDB Atlas database integration

## Tech Stack

**Frontend:**
- React
- JavaScript
- Tailwind CSS
- Lucide Icons

**Backend:**
- Node.js
- Express
- MongoDB Atlas
- JWT Authentication
- bcryptjs for password hashing

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account

### Installation

1. Install frontend dependencies:
```bash
npm install
```

2. Install backend dependencies:
```bash
cd server
npm install
```

### Running the Application

1. Start the backend server (from the server directory):
```bash
cd server
npm start
```

The server will run on http://localhost:3001

2. In a new terminal, start the frontend development server (from the root directory):
```bash
npm run dev
```

The frontend will run on http://localhost:5173

### Default Admin Account

To create an admin user, you can register a new user and then manually update the `isAdmin` field in MongoDB Atlas to `true`, or use the admin dashboard to create admin users after you have at least one admin account.

## Application Structure

### Frontend Routes

- `/login` - User login page
- `/register` - User registration page
- `/game` - Pac-Man game (requires authentication)
- `/admin` - Admin dashboard (requires admin privileges)

### Backend API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

**Admin:**
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create new user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get user statistics

## Game Controls

Use arrow keys to control Pac-Man:
- ⬆️ Arrow Up - Move up
- ⬇️ Arrow Down - Move down
- ⬅️ Arrow Left - Move left
- ➡️ Arrow Right - Move right

Collect all the dots while avoiding the ghosts!

## Admin Features

- View total users, logged-in users, and admin users
- Add new users with admin privileges
- Delete users (except yourself)
- View user login status
- Track last login times

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes
- Admin-only endpoints
- Secure password requirements (minimum 6 characters)

## Environment Variables

The backend uses the following environment variables (configured in `server/.env`):

- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3001)
