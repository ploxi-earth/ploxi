# Deployment Guide: Vercel + Render

This guide covers deploying your Ploxi Earth application with:
- **Frontend (Next.js 14)**: Vercel
- **Backend (Express + MongoDB)**: Render
- **Database (MongoDB)**: MongoDB Atlas

---

## Architecture Overview

```
┌─────────────────────────────────────┐
│  Vercel (Frontend - Next.js 14)     │
│  - Static & dynamic pages           │
│  - API routes (optional)            │
│  - Auto-deploys on git push         │
└──────────────┬──────────────────────┘
               │
               ├─ API calls to backend
               │
┌──────────────▼──────────────────────┐
│  Render (Backend - Express.js)      │
│  - REST API endpoints               │
│  - Authentication, validation       │
│  - Database connections             │
└──────────────┬──────────────────────┘
               │
               │ Queries & updates
               │
┌──────────────▼──────────────────────┐
│  MongoDB Atlas (Cloud Database)     │
│  - User accounts                    │
│  - Vendor data, documents           │
│  - Portal content                   │
└─────────────────────────────────────┘
```

---

# Part 1: MongoDB Atlas Setup (Cloud Database)

## Step 1: Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click "Start Free" → Sign up with email
3. Create a free cluster (M0 tier) - sufficient for small projects

## Step 2: Create Database Cluster
1. Click "Create Deployment" → Select "M0 (Free)"
2. Choose cloud provider: **AWS**
3. Choose region: **Asia Pacific (ap-south-1 for India)**
4. Click "Create"
5. Wait 2-3 minutes for cluster initialization

## Step 3: Create Database User
1. In left sidebar: **Security** → **Database Access**
2. Click "Add New Database User"
3. **Username**: `ploxi_admin`
4. **Password**: Generate strong password (copy this!)
5. **Built-in Role**: Select "Admin"
6. Click "Add User"

## Step 4: Whitelist IP Address
1. In left sidebar: **Security** → **Network Access**
2. Click "Add IP Address"
3. **Access from anywhere**: Click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ For production, restrict to specific IPs instead
4. Click "Confirm"

## Step 5: Get Connection String
1. Click "Connect" button (top of cluster page)
2. Select "Drivers" → **Node.js**
3. Copy the connection string:
   ```
   mongodb+srv://ploxi_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
4. Replace `<password>` with your database password
5. Save this - you'll need it for Render

---

# Part 2: Backend Deployment on Render

## Step 1: Push Backend to GitHub
```bash
cd /home/mrabdul/Desktop/ploxi_earth
git add backend/
git commit -m "Prepare backend for Render deployment"
git push
```

## Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (easier for auto-deploys)
3. Authorize Render to access your GitHub repositories

## Step 3: Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `ploxi_earth`
3. Click "Connect"

## Step 4: Configure Service
Fill in the following:

| Setting | Value |
|---------|-------|
| **Name** | `ploxi-api` |
| **Environment** | `Node` |
| **Region** | `Singapore` (closest to India) |
| **Branch** | `main` |
| **Build Command** | `npm install` |
| **Start Command** | `cd backend && npm start` |
| **Runtime** | `node-20` |

## Step 5: Add Environment Variables
Click "Advanced" → "Add Environment Variable"

Add these variables:

```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://ploxi_admin:<YOUR_PASSWORD>@cluster0.xxxxx.mongodb.net/ploxi?retryWrites=true&w=majority
CLIENT_URL=https://ploxi-earth.vercel.app
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
BACKEND_URL=https://ploxi-api.onrender.com
```

**Generate JWT Secret** (in terminal):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 6: Deploy
1. Click "Create Web Service"
2. Wait 3-5 minutes for build and deployment
3. Once live, you'll see URL: `https://ploxi-api.onrender.com`
4. Test backend health:
   ```
   curl https://ploxi-api.onrender.com/api/health
   ```

## Step 7: Update Frontend Environment
In `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=https://ploxi-api.onrender.com
API_URL=https://ploxi-api.onrender.com
```

---

# Part 3: Frontend Deployment on Vercel

## Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

## Step 2: Import Project
1. Click "Add New..." → "Project"
2. Select your `ploxi_earth` repository
3. Click "Import"

## Step 3: Configure Project
1. **Framework**: Next.js (auto-detected)
2. **Root Directory**: `./frontend`
3. Click "Edit" next to "Root Directory" and confirm it's set to `frontend`

## Step 4: Add Environment Variables
Scroll to "Environment Variables" and add:

```
NEXT_PUBLIC_API_URL=https://ploxi-api.onrender.com
```

(No need to add `API_URL` since backend is Render)

## Step 5: Deploy
1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Once complete, you'll see URL: `https://ploxi-earth.vercel.app`
4. Click "Visit" to see your live site

## Step 6: Update Backend CORS
Update backend `backend/src/server.js` CORS config:

```javascript
app.use(cors({
  origin: [
    'https://ploxi-earth.vercel.app',
    'http://localhost:3000'  // for local dev
  ],
  credentials: true,
}));
```

Push this change:
```bash
git add backend/
git commit -m "Update CORS for Vercel production URL"
git push
```

Render will auto-redeploy.

---

# Part 4: Setup Auto-Deployments

## GitHub → Vercel (Frontend)
Already configured! Every `git push` to `main` triggers automatic deployment.

## GitHub → Render (Backend)
Already configured! Every `git push` to `main` triggers automatic deployment.

---

# Part 5: Verify Everything Works

## 1. Test Backend API
```bash
# From terminal
curl https://ploxi-api.onrender.com/api/auth/test
```

## 2. Test Frontend Connection
Go to `https://ploxi-earth.vercel.app` and check:
- [ ] Pages load
- [ ] Can access vendor portal
- [ ] Can login with seed users
- [ ] No CORS errors in console

## 3. Monitor Logs
**Vercel Logs**: Dashboard → Project → Deployments → View Logs
**Render Logs**: Dashboard → Service → Logs

---

# Part 6: Environment Variables Reference

## Production URLs
```
Frontend: https://ploxi-earth.vercel.app
Backend:  https://ploxi-api.onrender.com
Database: MongoDB Atlas (cloud)
```

## Backend Environment Variables (.env)
```
NODE_ENV=production
PORT=10000
MONGO_URI=mongodb+srv://ploxi_admin:<password>@cluster0.xxxxx.mongodb.net/ploxi
CLIENT_URL=https://ploxi-earth.vercel.app
JWT_SECRET=<your-secure-random-string>
BACKEND_URL=https://ploxi-api.onrender.com
CORS_ORIGIN=https://ploxi-earth.vercel.app
```

## Frontend Environment Variables (Vercel)
```
NEXT_PUBLIC_API_URL=https://ploxi-api.onrender.com
```

---

# Part 7: Troubleshooting

## Frontend shows "503" or Can't Connect to API
**Cause**: Backend service is cold-starting
**Solution**: Render free tier spins down after 15 min inactivity. Click the URL to wake it up, then retry.

## CORS Error in Browser Console
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: 
1. Check `NEXT_PUBLIC_API_URL` is correct in Vercel
2. Check `CLIENT_URL` is correct in Render backend
3. Verify CORS middleware in `backend/src/server.js`

## 404 on Vercel
**Cause**: Root directory not set to `frontend`
**Solution**: 
1. Vercel → Project Settings → General
2. Confirm "Root Directory" = `frontend`
3. Redeploy

## Database Connection Fails
**Cause**: IP not whitelisted or connection string wrong
**Solution**:
1. Check MongoDB Atlas Network Access: all IPs allowed (0.0.0.0/0)
2. Check connection string has correct password
3. Test locally: `npm run dev` in backend with same `MONGO_URI`

## Render Service Won't Build
**Cause**: Start command path issue
**Solution**: 
In Render settings:
- Start Command: `cd backend && npm start`
- Build Command: `npm install`

---

# Part 8: Cost Analysis

| Service | Tier | Cost | Notes |
|---------|------|------|-------|
| Vercel | Hobby/Pro | Free/$20/mo | Free for hobby projects, includes 1,000 functions/mo |
| Render | Free Web Service | Free | 0.5 CPU, 512 MB RAM; spins down after 15 min inactivity |
| MongoDB Atlas | M0 (Free) | Free | 512 MB storage, perfect for development |

**Total for Free Tier**: $0/month ✅

---

# Part 9: Scaling for Production

When you're ready to upgrade:

### Frontend (Vercel)
- Upgrade to **Pro** ($20/mo) for priority support and unlimited functions
- Add edge middleware for global performance

### Backend (Render)
- Upgrade from free to **Standard** ($7/mo) for:
  - Always-on service (no spin-down)
  - 1 vCPU, 512 MB RAM
  - Better SLA

### Database (MongoDB)
- Upgrade from M0 to **M2** ($9/mo) for:
  - 2 GB storage (vs 512 MB)
  - Better performance
  - Backups

**Production Estimated Cost**: ~$36/month

---

# Part 10: Quick Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with strong password
- [ ] IP whitelisted (0.0.0.0/0 for now)
- [ ] Connection string saved securely
- [ ] Backend code pushed to GitHub
- [ ] Render account created
- [ ] Render service created with backend config
- [ ] Environment variables added to Render
- [ ] Backend deployment successful
- [ ] Frontend code on GitHub (in `/frontend` folder)
- [ ] Vercel account created
- [ ] Vercel project created with `/frontend` root
- [ ] Environment variables added to Vercel
- [ ] Frontend deployment successful
- [ ] CORS updated in backend for Vercel URL
- [ ] Tested API connectivity
- [ ] Tested login with seed users

---

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://docs.render.com
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## Next Steps

1. **Create MongoDB Atlas account** and get connection string
2. **Deploy backend to Render** with MongoDB connection
3. **Deploy frontend to Vercel** with backend URL
4. **Test all features** in production
5. **Monitor logs** for errors

Good luck! 🚀
