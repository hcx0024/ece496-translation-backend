# 🚀 Quick Start Guide

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

This will install all required packages:
- Express (web server)
- TypeScript (type safety)
- CORS (allow Swift app to connect)
- Axios (HTTP client for translation API)
- And all type definitions

## Step 2: Start the Server

```bash
npm run dev
```

You should see:
```
🚀 Server is running on http://localhost:3000
📚 Translation API available at http://localhost:3000/api/translate
💚 Health check at http://localhost:3000/health
```

## Step 3: Test the API

### Option A: Using curl (Terminal)

```bash
# Test health check
curl http://localhost:3000/health

# Test translation
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"word":"hello","targetLanguage":"es"}'

# Get supported languages
curl http://localhost:3000/api/translate/languages
```

### Option B: Using Browser

Open in browser:
- Health check: http://localhost:3000/health
- Languages: http://localhost:3000/api/translate/languages

### Option C: Using Postman/Insomnia

1. Create a POST request to `http://localhost:3000/api/translate`
2. Set header: `Content-Type: application/json`
3. Body (JSON):
```json
{
  "word": "hello",
  "targetLanguage": "es"
}
```

## Step 4: Share with Your Swift Teammate

Send them:
1. The `SWIFT_INTEGRATION.md` file
2. Your computer's IP address (if testing on real device)
3. The base URL: `http://localhost:3000` or `http://YOUR_IP:3000`

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts                      # Main server
│   ├── types/translation.types.ts    # TypeScript types
│   ├── routes/translation.routes.ts  # API routes
│   ├── controllers/translation.controller.ts  # Request handlers
│   └── services/translation.service.ts        # Translation logic
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── .env                              # Environment variables
├── README.md                         # Full documentation
├── SWIFT_INTEGRATION.md              # Guide for Swift teammate
└── QUICKSTART.md                     # This file
```

---

## 🔧 Available Commands

```bash
npm run dev      # Start development server (auto-reload)
npm run build    # Compile TypeScript to JavaScript
npm start        # Run production build
```

---

## 🌐 API Endpoints

### 1. Translate Word
**POST** `/api/translate`
```json
{
  "word": "hello",
  "targetLanguage": "es",
  "sourceLanguage": "auto"
}
```

### 2. Get Languages
**GET** `/api/translate/languages`

### 3. Health Check
**GET** `/health`

---

## ✅ Verify Everything Works

1. **Backend is running**: Visit http://localhost:3000/health
2. **Translation works**: Use curl or Postman to test
3. **Swift can connect**: Your teammate should test from their app

---

## 🐛 Common Issues

### "npm: command not found"
Install Node.js from https://nodejs.org/

### "Port 3000 already in use"
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### "Cannot find module"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 For Your Swift Teammate

Tell them to:
1. Read `SWIFT_INTEGRATION.md`
2. Copy the `TranslationAPI.swift` code
3. Update the `baseURL` to your backend URL
4. Start making API calls!

---

## 🎉 You're All Set!

Your backend is ready to receive translation requests from the Swift frontend.
