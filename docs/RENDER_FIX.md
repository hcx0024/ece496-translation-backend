# 🔧 Fix Render Deployment Error

## The Problem
```
npm error path /opt/render/project/src/package.json
npm error errno -2
npm error enoent Could not read package.json
```

This happens because Render is looking for `package.json` in the wrong directory.

## ✅ The Solution

You need to set the **Root Directory** in your Render service settings:

### Step-by-Step Fix:

1. **Go to your Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com)
   - Click on your `ece496-translation-api` service

2. **Update Settings**
   - Click **"Settings"** in the left sidebar
   - Scroll down to **"Build & Deploy"** section
   - Find **"Root Directory"** field
   - Enter: `backend`
   - Click **"Save Changes"**

3. **Trigger Manual Deploy**
   - Go to **"Manual Deploy"** section
   - Click **"Deploy latest commit"**
   - Wait 2-3 minutes for deployment

4. **Verify It Works**
   ```bash
   curl https://your-app-name.onrender.com/health
   ```

## Alternative: Check Your Settings

Make sure these are set correctly:

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Node Version** | Auto (uses >=18.0.0 from package.json) |

## Still Having Issues?

### Double-check your repository structure:
```
ece496-project/
├── backend/
│   ├── package.json    ← This must exist
│   ├── server.js
│   └── ...
└── QUICK_DEPLOY.md
```

### Verify package.json exists:
```bash
cd /Users/hcx/Documents/GitHub/ece496-project
ls -la backend/package.json
```

### Make sure it's pushed to GitHub:
```bash
git add .
git commit -m "Fix backend structure"
git push origin main
```

Then redeploy on Render!

---

**After fixing:** Your deployment should succeed and you'll see:
```
==> Build successful 🎉
==> Starting service...
🚀 Translation API server running on port 3000
```
