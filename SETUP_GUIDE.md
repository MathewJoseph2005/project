# Quick Setup Guide

## Step-by-Step Instructions

### 1. Install Dependencies

First, install the frontend dependencies:
```bash
npm install
```

Then, install the backend dependencies:
```bash
cd server
npm install
cd ..
```

### 2. Start the Backend Server

Open a terminal and run:
```bash
cd server
npm start
```

You should see:
```
Server running on port 3001
Connected to MongoDB Atlas
```

**Keep this terminal open!**

### 3. Start the Frontend

Open a NEW terminal and run:
```bash
npm run dev
```

You should see the Vite dev server start.

### 4. Access the Application

Open your browser and go to: http://localhost:5173

### 5. Create Your First Admin User

1. Click "Register here" on the login page
2. Create a new account with:
   - Username: admin
   - Email: admin@example.com
   - Password: admin123 (or any password you prefer)

3. After registration, you'll need to manually set this user as admin:
   - Go to MongoDB Atlas Dashboard
   - Navigate to your cluster > Browse Collections
   - Find the `users` collection in the `pacman-app` database
   - Find your user and click "Edit"
   - Change `isAdmin` from `false` to `true`
   - Save

4. Log out and log back in. You should now see the "Admin Dashboard" button.

### 6. Using the Application

**As a Regular User:**
- After login, you'll be directed to the game page
- Use arrow keys to play Pac-Man
- Try to collect all dots while avoiding ghosts

**As an Admin:**
- Access the Admin Dashboard to view all users
- See how many users are logged in
- Add new users (can set them as admin too)
- Delete users
- View user statistics

## Troubleshooting

### Backend won't start
- Make sure MongoDB Atlas connection string is correct in `server/.env`
- Check if port 3001 is not being used by another application

### Frontend can't connect to backend
- Make sure the backend server is running on port 3001
- Check browser console for CORS errors

### MongoDB connection failed
- Verify your MongoDB Atlas cluster is running
- Check that your IP address is whitelisted in MongoDB Atlas
- Ensure the database username and password are correct

## Creating Additional Admin Users

Once you have one admin user, you can create more admins through the Admin Dashboard:
1. Login as admin
2. Go to Admin Dashboard
3. Click "Add User"
4. Fill in the details and check "Admin User"
5. Click "Create User"

## Notes

- The application uses JWT tokens stored in localStorage
- Tokens expire after 24 hours
- Users are marked as "logged in" in the database when they login
- The game saves your score but resets when you refresh
