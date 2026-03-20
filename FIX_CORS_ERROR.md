# 🔧 Fix CORS Error - Step by Step

## Problem
```
Access to XMLHttpRequest at 'https://ploxi-api.onrender.com/api/auth/login' 
from origin 'https://ploxi-sable.vercel.app' has been blocked by CORS policy
```

**Cause**: Backend CORS is only allowing `http://localhost:3000`, not your Vercel URL.

## Solution

### Step 1: Update Backend Code ✅ (Already Done!)
The CORS configuration has been updated to accept:
- ✅ `http://localhost:3000` (local dev)
- ✅ `https://ploxi-sable.vercel.app` (your production)
- ✅ `https://ploxi-earth.vercel.app` (alternative)

### Step 2: Push Changes to GitHub
```bash
cd /home/mrabdul/Desktop/ploxi_earth

git add backend/src/server.js
git commit -m "Fix: Update CORS to allow Vercel frontend URLs"
git push
```

### Step 3: Render Auto-Redeploys
Wait 2-3 minutes. Render will automatically detect the new code and redeploy.

You should see in Render dashboard:
- Status: "Deploying..."
- Then: "Live ✓"

### Step 4: Test Login
1. Go to `https://ploxi-sable.vercel.app`
2. Try login:
   - **Email**: `admin@ploxi.earth`
   - **Password**: `Admin@2026!`
3. Should work! ✅

---

## Verify It's Fixed

### Check Backend CORS Header
Open browser console and paste:
```javascript
fetch('https://ploxi-api.onrender.com/api/health', { credentials: 'include' })
  .then(r => {
    console.log('✅ CORS working!');
    console.log('Access-Control-Allow-Origin:', r.headers.get('access-control-allow-origin'));
    return r.json();
  })
  .then(data => console.log(data))
  .catch(err => console.error('❌ CORS error:', err.message));
```

Expected output:
```
✅ CORS working!
Access-Control-Allow-Origin: https://ploxi-sable.vercel.app
{ success: true, message: "Ploxi Earth API is running", ... }
```

---

## What Changed

**Before**:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  // ❌ Only allows ONE origin
}));
```

**After**:
```javascript
const allowedOrigins = [
  'http://localhost:3000',           // Local dev
  'http://localhost:3001',           // Local fallback
  'https://ploxi-sable.vercel.app',  // ✅ Production
  'https://ploxi-earth.vercel.app',  // Alternative
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS not allowed for origin: ${origin}`));
    }
  },
  // ✅ Allows multiple origins
}));
```

---

## Troubleshooting

### Still Getting CORS Error?

1. **Check Render Deployment Status**
   - Go to [render.com](https://render.com)
   - Select `ploxi-api` service
   - Should say "Live ✓"
   - If "Deploying", wait a few more minutes

2. **Check Render Logs**
   - Render → Dashboard → `ploxi-api` → Logs tab
   - Look for any errors during deployment
   - Should see: `Ploxi Earth API running on port 10000 [production]`

3. **Hard Refresh Frontend**
   - Press **Ctrl+Shift+R** (Windows/Linux)
   - Or **Cmd+Shift+R** (Mac)
   - Or Ctrl+F5

4. **Clear Browser Cache**
   - DevTools → Application → Clear site data
   - Try again

### Different Vercel URL?

If your Vercel URL is different than `ploxi-sable.vercel.app`:

1. Update `backend/src/server.js` line 36 with your actual URL
2. Example: `'https://your-project-name.vercel.app'`
3. Git push → Render redeploys automatically

---

## Timeline

| Step | Time | Status |
|------|------|--------|
| 1. Push code change | Now | 🔄 In progress |
| 2. Render deploys | 2-3 min | ⏳ Pending |
| 3. API responds with new CORS | 3-5 min | ⏳ Pending |
| 4. Login works | 5 min | 🎯 Goal |

---

## Next Steps

✅ 1. Commit and push backend changes
✅ 2. Wait for Render to redeploy
✅ 3. Test login from Vercel
✅ 4. Verify API requests work

Done! Your app should now work in production. 🚀
