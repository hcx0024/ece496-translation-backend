# ⚡ Quick Deploy - TL;DR

Fast deployment guide for those who want to get to production quickly.

---

## 🚀 5-Minute Deployment

### Step 1: Push to GitHub (1 min)

```bash
cd /Users/hcx/Documents/GitHub/ece496-project
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### Step 2: Deploy to Render.com (3 min)

1. Go to https://render.com
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your `ece496-project` repository
5. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
6. Add environment variables:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
7. Click **"Create Web Service"**

### Step 3: Get Your URL (1 min)

After deployment completes, copy your URL:
```
https://ece496-translation-api.onrender.com
```

### Step 4: Update Frontend

Edit `frontend/TranslationAPI.swift` line 15:
```swift
static let baseURL = "https://YOUR-ACTUAL-URL.onrender.com"
```

---

## ✅ Test It

```bash
# Replace with your actual URL
curl https://ece496-translation-api.onrender.com/health

curl -X POST https://ece496-translation-api.onrender.com/api/translate \
  -H "Content-Type: application/json" \
  -d '{"word":"hello","targetLanguage":"es"}'
```

---

## 🎉 Done!

Your backend is live! Share the URL with your teammate.

**For detailed instructions, see `DEPLOYMENT_GUIDE.md`**
