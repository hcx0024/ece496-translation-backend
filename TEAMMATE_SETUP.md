# 👥 Setup Guide for Swift Teammate

This guide is for the **frontend developer** who wants to test the app without setting up the backend locally.

---

## 🎯 Good News!

**You don't need to run the backend locally!** The backend is deployed to production and ready to use.

---

## 🚀 Quick Start (2 Minutes)

### Step 1: Clone/Pull the Repository

```bash
# If you haven't cloned yet:
git clone https://github.com/YOUR_USERNAME/ece496-project.git
cd ece496-project

# If you already have it:
git pull origin main
```

### Step 2: Open the iOS Project

```bash
cd frontend
open *.xcodeproj
```

### Step 3: Add TranslationAPI.swift to Xcode

1. In Xcode, right-click on the project navigator
2. Select **"Add Files to [Project Name]"**
3. Navigate to the `frontend` folder
4. Select `TranslationAPI.swift`
5. Make sure **"Copy items if needed"** is **unchecked**
6. Click **"Add"**

### Step 4: Run the App

1. Select iPhone Simulator (e.g., iPhone 15 Pro)
2. Click **Run** (⌘R)
3. Take/select a photo
4. See classification + translation! 🎉

---

## 🌐 Backend Configuration

The app is **already configured** to use the production backend:

```swift
// In TranslationAPI.swift
private static let USE_PRODUCTION = true  // ✅ Uses production backend
```

**This means:**
- ✅ No need to run backend locally
- ✅ No need to install Node.js or npm
- ✅ Works from anywhere with internet
- ✅ Just open Xcode and run!

---

## 🔄 Switching Between Local and Production

If you want to test with a **local backend** (requires backend teammate's help):

### Option 1: Use Production (Default - Recommended)
```swift
private static let USE_PRODUCTION = true
```
- ✅ No setup needed
- ✅ Works immediately
- ⚠️ First request after 15 min may take ~30 seconds (free tier wakes up)

### Option 2: Use Local Backend
```swift
private static let USE_PRODUCTION = false
```
- ⚠️ Requires backend running locally (`npm run dev`)
- ⚠️ Backend teammate must share their code
- ✅ Faster responses (no network delay)
- ✅ Works offline

---

## 📱 Testing on Real Device

### For Simulator (Default)
No changes needed! Production URL works on simulator.

### For Real iPhone/iPad
Production URL works on real devices too! Just make sure you have internet connection.

---

## 🧪 How to Test

### Test 1: Basic Translation

1. Run the app in Xcode
2. Take/select a photo of a dog
3. Wait for classification
4. You should see:
   ```
   golden retriever - 95%

   🌐 Translation (Spanish):
   golden retriever
   ```

### Test 2: Different Objects

Try photos of:
- **Animals:** dog, cat, bird
- **Objects:** car, phone, laptop
- **Food:** pizza, burger, apple

### Test 3: Check Backend Status

Open Safari and visit:
```
https://ece496-translation-api.onrender.com/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Translation API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🐛 Troubleshooting

### Issue: "Translation unavailable" appears

**Possible causes:**
1. No internet connection
2. Backend is sleeping (free tier)
3. Backend is down

**Solutions:**
1. Check your internet connection
2. Wait 30 seconds and try again (backend wakes up)
3. Check backend status: https://ece496-translation-api.onrender.com/health
4. Contact backend teammate

### Issue: First translation is slow (~30 seconds)

**Cause:** Free tier backend sleeps after 15 minutes of inactivity

**Solution:** This is normal! Subsequent requests will be fast.

### Issue: "Cannot find type 'TranslationAPI'"

**Cause:** TranslationAPI.swift not added to Xcode project

**Solution:** Follow Step 3 above to add the file

### Issue: App crashes when selecting photo

**Cause:** Missing file or wrong target membership

**Solution:**
1. Make sure TranslationAPI.swift is in the project
2. Click on the file → File Inspector → Target Membership → Check your app target

---

## 📊 What Happens Behind the Scenes

```
1. You take a photo
   ↓
2. Core ML classifies it → "golden retriever"
   ↓
3. App sends to production backend:
   POST https://ece496-translation-api.onrender.com/api/translate
   {"word": "golden retriever", "targetLanguage": "es"}
   ↓
4. Backend translates it
   ↓
5. App receives translation and displays it
```

---

## 🔧 Backend API Reference

### Endpoint: Translate Word

**URL:** `POST https://ece496-translation-api.onrender.com/api/translate`

**Request:**
```json
{
  "word": "hello",
  "targetLanguage": "es",
  "sourceLanguage": "en"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "originalWord": "hello",
    "translatedWord": "hola",
    "sourceLanguage": "en",
    "targetLanguage": "es"
  }
}
```

### Supported Languages

| Code | Language |
|------|----------|
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `it` | Italian |
| `pt` | Portuguese |
| `zh` | Chinese |
| `ja` | Japanese |
| `ko` | Korean |

---

## 💡 Tips

1. **First request is slow?** Normal! Backend wakes up in ~30 seconds.
2. **Want to change language?** Edit `MainViewController.swift` line ~200:
   ```swift
   TranslationAPI.translate(word: classificationWord, to: "fr") // French
   ```
3. **Testing offline?** Switch to local backend (requires backend setup)
4. **Need help?** Contact your backend teammate

---

## ✅ Checklist

Before you start:
- [ ] Pulled latest code from GitHub
- [ ] Opened Xcode project
- [ ] Added TranslationAPI.swift to project
- [ ] Verified `USE_PRODUCTION = true` in TranslationAPI.swift
- [ ] App builds successfully
- [ ] Internet connection available

---

## 🎉 You're Ready!

You can now develop and test the iOS app without any backend setup. The production backend handles all translation requests automatically.

**Questions?** Ask your backend teammate or check:
- `DEPLOYMENT_GUIDE.md` - Backend deployment info
- `INTEGRATION_EXAMPLE.md` - How frontend/backend connect
- `TESTING_GUIDE.md` - Complete testing guide

Happy coding! 🚀
