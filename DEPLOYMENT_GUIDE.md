# 🚀 Deployment Guide - Production Setup

This guide will help you deploy your TypeScript backend to production using Render.com (free tier).

---

## 📋 Prerequisites

- [x] Backend code is working locally
- [ ] GitHub account
- [ ] Render.com account (free - sign up at https://render.com)
- [ ] Code pushed to GitHub

---

## 🌐 Deployment Options

### Option 1: Render.com (Recommended - Free Tier)
- ✅ Free tier available
- ✅ Automatic deployments from GitHub
- ✅ HTTPS included
- ✅ Easy setup
- ⚠️ Sleeps after 15 min of inactivity (wakes up in ~30 seconds)

### Option 2: Railway.app
- ✅ Free tier ($5 credit/month)
- ✅ Very easy setup
- ✅ No sleep mode

### Option 3: Heroku
- ⚠️ Requires credit card (even for free tier)
- ✅ Reliable and popular

**This guide covers Render.com (easiest and truly free)**

---

## 🚀 Step-by-Step Deployment to Render.com

### Step 1: Push Your Code to GitHub

Make sure all your changes are committed and pushed:

```bash
cd /Users/hcx/Documents/GitHub/ece496-project

# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Prepare backend for production deployment"

# Push to GitHub
git push origin main
```

**Important:** Make sure the `backend` folder is in your GitHub repository.

---

### Step 2: Sign Up for Render.com

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account (easiest option)
4. Authorize Render to access your repositories

---

### Step 3: Create a New Web Service

1. **Click "New +"** in the top right
2. **Select "Web Service"**
3. **Connect your GitHub repository:**
   - Find your `ece496-project` repository
   - Click "Connect"

4. **Configure the service:**
   - **Name:** `ece496-translation-api` (or any name you like)
   - **Region:** Choose closest to you (e.g., Oregon, Frankfurt)
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

5. **Select Free Plan:**
   - Scroll down to "Instance Type"
   - Select **"Free"** ($0/month)

6. **Environment Variables:**
   Click "Add Environment Variable" and add:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `LIBRETRANSLATE_URL` = `https://libretranslate.com`

7. **Click "Create Web Service"**

---

### Step 4: Wait for Deployment

Render will now:
1. Clone your repository
2. Install dependencies (`npm install`)
3. Build your TypeScript code (`npm run build`)
4. Start your server (`npm start`)

**This takes 2-5 minutes.** Watch the logs in real-time.

**Expected logs:**
```
==> Cloning from https://github.com/YOUR_USERNAME/ece496-project...
==> Running 'npm install'
==> Running 'npm run build'
==> Starting service with 'npm start'
🚀 Server is running on http://localhost:3000
```

---

### Step 5: Get Your Production URL

Once deployed, Render gives you a URL like:
```
https://ece496-translation-api.onrender.com
```

**Copy this URL!** You'll need it for the frontend.

---

### Step 6: Test Your Production API

Test your deployed API:

```bash
# Health check
curl https://ece496-translation-api.onrender.com/health

# Translation test
curl -X POST https://ece496-translation-api.onrender.com/api/translate \
  -H "Content-Type: application/json" \
  -d '{"word":"hello","targetLanguage":"es"}'
```

**Expected response:**
```json
{"success":true,"data":{"originalWord":"hello","translatedWord":"hola","sourceLanguage":"en","targetLanguage":"es"}}
```

---

## 📱 Update Frontend to Use Production URL

### Step 1: Update TranslationAPI.swift

Edit `/Users/hcx/Documents/GitHub/ece496-project/frontend/TranslationAPI.swift`:

```swift
class TranslationAPI {

    // PRODUCTION URL - Replace with your actual Render URL
    static let baseURL = "https://ece496-translation-api.onrender.com"

    // For local development, use:
    // static let baseURL = "http://localhost:3000"
```

### Step 2: Make it Configurable (Better Approach)

Create a configuration that switches between development and production:

```swift
class TranslationAPI {

    #if DEBUG
    // Development - local backend
    static let baseURL = "http://localhost:3000"
    #else
    // Production - deployed backend
    static let baseURL = "https://ece496-translation-api.onrender.com"
    #endif
```

This way:
- **Debug builds** (when testing in Xcode) use `localhost:3000`
- **Release builds** (when distributing the app) use production URL

---

## 🔄 Automatic Deployments

Render automatically redeploys when you push to GitHub:

1. Make changes to your backend code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update backend"
   git push
   ```
3. Render automatically detects the push and redeploys
4. Wait 2-5 minutes for deployment to complete

---

## 📊 Monitoring Your Deployment

### View Logs

In Render dashboard:
1. Click on your service
2. Go to "Logs" tab
3. See real-time logs of your API

### Check Status

- **Green dot** = Service is running
- **Yellow dot** = Deploying
- **Red dot** = Error (check logs)

### Metrics

Render shows:
- CPU usage
- Memory usage
- Request count
- Response times

---

## ⚠️ Important Notes About Free Tier

### Sleep Mode
- Free tier services **sleep after 15 minutes** of inactivity
- First request after sleep takes **~30 seconds** to wake up
- Subsequent requests are fast

### Solutions:
1. **Accept the delay** (simplest for development)
2. **Ping service every 10 minutes** (keeps it awake)
3. **Upgrade to paid tier** ($7/month - no sleep)

### Keep-Alive Script (Optional)

If you want to prevent sleep, you can ping your API every 10 minutes:

```bash
# Run this on your computer or use a service like cron-job.org
while true; do
  curl https://ece496-translation-api.onrender.com/health
  sleep 600  # 10 minutes
done
```

Or use a free service like **UptimeRobot** or **cron-job.org** to ping your API.

---

## 🐛 Troubleshooting

### Deployment Failed

**Check the logs:**
1. Go to Render dashboard
2. Click on your service
3. Check "Logs" tab for errors

**Common issues:**
- Missing dependencies in `package.json`
- TypeScript compilation errors
- Wrong Node version

**Solutions:**
```bash
# Test build locally first
cd backend
npm install
npm run build
npm start
```

### API Returns 404

**Problem:** Wrong URL or route

**Solution:**
- Make sure you're using the correct Render URL
- Check that routes are correct: `/api/translate` not `/translate`

### CORS Errors

**Problem:** Frontend can't access backend

**Solution:** Already configured in `src/index.ts` with `origin: '*'`

### Service Keeps Crashing

**Check logs for errors:**
- Port binding issues (should use `process.env.PORT`)
- Missing environment variables
- Runtime errors

---

## 🔒 Security Considerations

### Current Setup (Development)
- CORS allows all origins (`origin: '*'`)
- No authentication
- No rate limiting

### For Production (Recommended)

1. **Restrict CORS to your app:**
   ```typescript
   app.use(cors({
     origin: ['https://your-app-domain.com'],
     methods: ['GET', 'POST'],
     allowedHeaders: ['Content-Type']
   }));
   ```

2. **Add rate limiting:**
   ```bash
   npm install express-rate-limit
   ```
   ```typescript
   import rateLimit from 'express-rate-limit';

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });

   app.use('/api/', limiter);
   ```

3. **Add API key authentication** (if needed)

---

## 💰 Cost Breakdown

### Free Tier (Render.com)
- **Cost:** $0/month
- **Limitations:**
  - 750 hours/month (enough for 1 service)
  - Sleeps after 15 min inactivity
  - 512 MB RAM
  - Shared CPU

### Paid Tier (If Needed)
- **Starter:** $7/month
  - No sleep
  - 512 MB RAM
  - 0.5 CPU

**For your project, free tier is perfect!**

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Web service created on Render
- [ ] Environment variables set
- [ ] Deployment successful (check logs)
- [ ] Health check works: `curl https://YOUR_URL/health`
- [ ] Translation works: Test with curl
- [ ] Frontend updated with production URL
- [ ] App tested with production backend

---

## 🎉 You're Live!

Your backend is now deployed and accessible from anywhere!

**Share with your teammate:**
- Production URL: `https://ece496-translation-api.onrender.com`
- API endpoint: `https://ece496-translation-api.onrender.com/api/translate`
- Health check: `https://ece496-translation-api.onrender.com/health`

---

## 📞 Alternative: Railway.app Deployment

If you prefer Railway (also free):

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `backend`
6. Add environment variables
7. Deploy!

Railway gives you a URL like: `https://ece496-translation-api.up.railway.app`

---

## 🔄 Next Steps

1. **Monitor your deployment** - Check logs regularly
2. **Test thoroughly** - Make sure everything works in production
3. **Share the URL** - Update your teammate
4. **Consider upgrades** - If you need no-sleep mode, upgrade to paid tier
5. **Add monitoring** - Use UptimeRobot to monitor uptime

Good luck with your deployment! 🚀
