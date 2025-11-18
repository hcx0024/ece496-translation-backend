# ⚡ Quick Deploy Guide

Get your translation backend live in 5 minutes!

## 🚀 Step 1: Install Dependencies (30 seconds)

```bash
cd /Users/hcx/Documents/GitHub/ece496-project/backend
npm install
```

## 🧪 Step 2: Test Locally (1 minute)

```bash
# Start the server
npm start
```

In another terminal, test it:
```bash
# Health check
curl http://localhost:3000/health

# Test translation
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"word":"hello","targetLanguage":"es"}'
```

You should see:
```json
{
  "success": true,
  "original": "hello",
  "translated": "hola",
  "targetLanguage": "es",
  ...
}
```

## 📤 Step 3: Push to GitHub (1 minute)

```bash
cd /Users/hcx/Documents/GitHub/ece496-project
git add .
git commit -m "Add translation backend"
git push origin main
```

## 🌐 Step 4: Deploy to Render (3 minutes)

1. **Go to [render.com](https://render.com)** and sign up with GitHub

2. **Click "New +" → "Web Service"**

3. **Connect your `ece496-project` repository**

4. **Configure the service:**
   - **Name**: `ece496-translation-api` (or any name you like)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. **Add Environment Variable:**
   - Click "Advanced"
   - Add: `NODE_ENV` = `production`

6. **Click "Create Web Service"**

7. **Wait 2-3 minutes** for deployment to complete

8. **Copy your URL**: `https://ece496-translation-api.onrender.com` (or your chosen name)

## 📱 Step 5: Update Swift Frontend

Share this URL with your teammate. They should update their Swift code:

```swift
class TranslationAPI {
    static let baseURL = "https://ece496-translation-api.onrender.com"
    // ... rest of the code
}
```

## ✅ Step 6: Test Production

```bash
# Replace with your actual Render URL
curl https://ece496-translation-api.onrender.com/health

curl -X POST https://ece496-translation-api.onrender.com/api/translate \
  -H "Content-Type: application/json" \
  -d '{"word":"hello","targetLanguage":"fr"}'
```

## 🎉 Done!

Your backend is now live and ready to handle requests from the Swift frontend!

### API Endpoints Available:
- `GET /health` - Health check
- `POST /api/translate` - Translate words
- `GET /api/languages` - Get supported languages

### Request Format for Swift:
```json
{
  "word": "hello",
  "targetLanguage": "es"
}
```

### Response Format:
```json
{
  "success": true,
  "original": "hello",
  "translated": "hola",
  "targetLanguage": "es",
  "confidence": 1,
  "alternatives": [...],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

**Need more details?** Check `backend/README.md` for full documentation.

**Having issues?** Check the Troubleshooting section in the README.
