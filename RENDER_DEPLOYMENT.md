# Pac-Man Arena - Render Deployment Guide

## Pre-Deployment Checklist

- [ ] MongoDB Atlas connection string ready (`.env` MONGODB_URI)
- [ ] JWT_SECRET configured (generate a strong secret for production)
- [ ] Frontend build succeeds (`npm run build`)
- [ ] Server starts without errors (`cd server && npm start`)

## Deployment Steps

### 1. Prepare Your Repository

Ensure your project is pushed to GitHub (Render connects to GitHub):

```bash
git add .
git commit -m "Production-ready setup for Render"
git push origin main
```

### 2. Environment Variables Setup

In your Render dashboard, set these environment variables:

```
MONGODB_URI: Your MongoDB Atlas connection string
JWT_SECRET: A strong random secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
CORS_ORIGIN: https://your-app-name.onrender.com (set after deployment)
NODE_ENV: production
PORT: 3001
```

### 3. Create Web Service on Render

1. Go to [render.com](https://render.com)
2. Connect your GitHub account
3. Click "New +" → "Web Service"
4. Select your repository
5. Configure:
   - **Name**: pacman-game-server
   - **Environment**: Node
   - **Build Command**: `npm install --prefix server && npm run build`
   - **Start Command**: `cd server && NODE_ENV=production node server.js`
   - **Instance Type**: Free (starter tier)

### 4. Set Environment Variables

In the Render dashboard:
- Add all variables from step 2
- Make sure `CORS_ORIGIN` matches your Render app URL

### 5. Deploy

Click "Deploy" button. Render will:
1. Clone your repo
2. Run build command (builds frontend, installs backend)
3. Start the server using start command
4. Serve frontend static files + API from single instance

## Architecture

- **Single Render Web Service** running Node.js
- Frontend (React) built to `dist/` folder
- Backend (Express) serves static files + API routes
- All requests go to same domain (no CORS issues)

## Monitoring & Troubleshooting

### Check Logs

In Render dashboard → Logs tab:
- Look for "Server running on port 3001"
- Check for MongoDB connection messages
- Monitor for runtime errors

### Common Issues

**Frontend shows 404**
- Ensure `dist` folder exists
- Check that build command completed successfully

**API requests fail**
- Verify CORS_ORIGIN matches deployment URL
- Check MongoDB URI is correct and accessible from Render IP

**Blank pages**
- Check browser console for errors
- Verify `.env.production` is setting VITE_API_URL correctly

## Local Testing Before Deploy

```bash
# Build frontend
npm run build

# Test backend with production build
cd server
NODE_ENV=production node server.js

# Frontend should be served at http://localhost:3001
# API available at http://localhost:3001/api
```

## Next Steps

1. Add custom domain (if needed)
2. Set up error monitoring (e.g., Sentry)
3. Configure analytics
4. Set up automatic deploys on git push
