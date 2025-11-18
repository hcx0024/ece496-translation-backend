# ECE496 Translation API Backend

A Node.js/Express backend that provides translation services for a Swift frontend application.

## 🚀 Features

- **Translation API**: Translate words from English to multiple languages
- **External Dictionary Integration**: Uses MyMemory Translation API (free, no API key required)
- **CORS Enabled**: Ready for Swift frontend integration
- **Render.com Ready**: Configured for easy deployment
- **Health Checks**: Built-in health monitoring endpoint

## 📋 API Endpoints

### 1. Health Check
```
GET /health
```
Returns server health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

### 2. Translate Word
```
POST /api/translate
```

**Request Body:**
```json
{
  "word": "hello",
  "targetLanguage": "es"
}
```

**Response:**
```json
{
  "success": true,
  "original": "hello",
  "translated": "hola",
  "targetLanguage": "es",
  "confidence": 1,
  "alternatives": [
    {
      "translation": "hola",
      "quality": "100",
      "source": "MyMemory"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. Get Supported Languages
```
GET /api/languages
```

**Response:**
```json
{
  "success": true,
  "languages": [
    { "code": "es", "name": "Spanish" },
    { "code": "fr", "name": "French" },
    ...
  ]
}
```

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Setup

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Create environment file:**
```bash
cp .env.example .env
```

3. **Start development server:**
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Test the API

```bash
# Health check
curl http://localhost:3000/health

# Translate a word
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"word":"hello","targetLanguage":"es"}'

# Get supported languages
curl http://localhost:3000/api/languages
```

## 🌐 Deploy to Render.com

### Quick Deploy Steps

1. **Push code to GitHub:**
```bash
git add .
git commit -m "Add translation backend"
git push origin main
```

2. **Create Render Web Service:**
   - Go to [render.com](https://render.com)
   - Sign up/login with GitHub
   - Click **"New +"** → **"Web Service"**
   - Connect your repository
   - Configure:
     - **Name**: `ece496-translation-api` (or your choice)
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Add Environment Variables:**
   - `NODE_ENV` = `production`
   - `PORT` = `3000` (optional, Render sets this automatically)

4. **Deploy:**
   - Click **"Create Web Service"**
   - Wait for deployment (2-3 minutes)
   - Copy your URL: `https://your-app-name.onrender.com`

### Test Production Deployment

```bash
# Replace with your actual Render URL
curl https://your-app-name.onrender.com/health

curl -X POST https://your-app-name.onrender.com/api/translate \
  -H "Content-Type: application/json" \
  -d '{"word":"hello","targetLanguage":"es"}'
```

## 📱 Swift Frontend Integration

### Example Swift Code

```swift
import Foundation

struct TranslationRequest: Codable {
    let word: String
    let targetLanguage: String
}

struct TranslationResponse: Codable {
    let success: Bool
    let original: String
    let translated: String
    let targetLanguage: String
    let confidence: Double
    let timestamp: String
}

class TranslationAPI {
    static let baseURL = "https://your-app-name.onrender.com"

    static func translate(word: String, to language: String, completion: @escaping (Result<TranslationResponse, Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/api/translate") else {
            completion(.failure(NSError(domain: "Invalid URL", code: -1)))
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = TranslationRequest(word: word, targetLanguage: language)
        request.httpBody = try? JSONEncoder().encode(body)

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(NSError(domain: "No data", code: -1)))
                return
            }

            do {
                let result = try JSONDecoder().decode(TranslationResponse.self, from: data)
                completion(.success(result))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
}

// Usage
TranslationAPI.translate(word: "hello", to: "es") { result in
    switch result {
    case .success(let translation):
        print("Translated: \(translation.translated)")
    case .failure(let error):
        print("Error: \(error)")
    }
}
```

## 🔧 Supported Languages

- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Japanese (ja)
- Korean (ko)
- Chinese Simplified (zh-CN)
- Chinese Traditional (zh-TW)
- Arabic (ar)
- Hindi (hi)
- Dutch (nl)
- Polish (pl)
- Turkish (tr)

## 📝 Project Structure

```
backend/
├── server.js           # Main Express server
├── package.json        # Dependencies and scripts
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## 🐛 Troubleshooting

### Local Development Issues

**Port already in use:**
```bash
# Change PORT in .env file
PORT=3001
```

**Dependencies not installing:**
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Render Deployment Issues

**Build fails:**
- Check that `backend` is set as the Root Directory
- Verify Build Command is `npm install`
- Check Node version in `package.json` engines

**Service not responding:**
- Check Render logs for errors
- Verify environment variables are set
- Ensure Start Command is `npm start`

**CORS errors from Swift:**
- CORS is enabled by default for all origins
- Check that you're using the correct Render URL

## 📄 License

MIT
