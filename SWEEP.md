# SWEEP.md - Project Commands & Information

## Backend Commands

### Install Dependencies
```bash
cd /Users/hcx/Documents/GitHub/ece496-project/backend
npm install
```

### Start Server (Development)
```bash
cd /Users/hcx/Documents/GitHub/ece496-project/backend
npm start
```

### Start Server (Development with Auto-reload)
```bash
cd /Users/hcx/Documents/GitHub/ece496-project/backend
npm run dev
```

### Run Tests
```bash
cd /Users/hcx/Documents/GitHub/ece496-project/backend
npm test
```

### Test API Endpoints Manually

**Health Check:**
```bash
curl http://localhost:3000/health
```

**Translate Word:**
```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"word":"hello","targetLanguage":"es"}'
```

**Get Supported Languages:**
```bash
curl http://localhost:3000/api/languages
```

## Project Structure

```
ece496-project/
├── backend/
│   ├── server.js                # Main Express server
│   ├── package.json             # Dependencies and scripts
│   ├── test.js                  # Automated test suite
│   ├── .env.example             # Environment variables template
│   ├── .gitignore               # Git ignore rules
│   └── README.md                # Backend documentation
├── QUICK_DEPLOY.md              # Deployment guide
├── RENDER_FIX.md                # Fix Render deployment errors
├── SWIFT_INTEGRATION_GUIDE.md   # Guide for Swift developers
└── SWEEP.md                     # This file
```

## Technology Stack

- **Backend**: Node.js + Express
- **Translation API**: MyMemory Translation API (free, no API key required)
- **CORS**: Enabled for Swift frontend
- **Deployment**: Render.com

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

## Documentation Files

- **`QUICK_DEPLOY.md`** - Step-by-step deployment to Render.com
- **`RENDER_FIX.md`** - Fix common Render deployment errors (especially "Root Directory" issue)
- **`SWIFT_INTEGRATION_GUIDE.md`** - Complete guide for Swift developers (beginner-friendly)
- **`backend/README.md`** - Full backend API documentation

## Deployment

See `QUICK_DEPLOY.md` for step-by-step deployment instructions to Render.com.

**IMPORTANT:** Make sure to set **Root Directory** to `backend` in Render settings!

If deployment fails, check `RENDER_FIX.md` for solutions.

## For Swift Developers

Share `SWIFT_INTEGRATION_GUIDE.md` with your Swift teammate. It includes:
- How to test the API (no code required)
- Copy-paste ready Swift code
- SwiftUI example app
- Common issues and solutions
- Complete beginner-friendly explanations

## Node Version

- Node.js >= 18.0.0 (currently using v24.11.0)

## Git Commands

### Push to GitHub
```bash
cd /Users/hcx/Documents/GitHub/ece496-project
git add .
git commit -m "Your commit message"
git push origin main
```

### Check Status
```bash
git status
```

## Quick Start Summary

1. **Install**: `cd backend && npm install`
2. **Test Locally**: `npm start` then test with curl
3. **Deploy**: Follow `QUICK_DEPLOY.md`
4. **Share with Swift Dev**: Send them `SWIFT_INTEGRATION_GUIDE.md`
