# Translation API Backend

A TypeScript/Express backend that provides translation services for the ECE496 project.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

---

## 📡 API Endpoints

### 1. Translate a Word

**Endpoint:** `POST /api/translate`

**Request Body:**
```json
{
  "word": "hello",
  "targetLanguage": "es",
  "sourceLanguage": "en"
}
```

**Parameters:**
- `word` (required): The word to translate
- `targetLanguage` (required): Target language code (e.g., "es", "fr", "de")
- `sourceLanguage` (optional): Source language code. Defaults to "auto" for auto-detection

**Response (Success):**
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

**Response (Error):**
```json
{
  "success": false,
  "error": "Missing required fields: word and targetLanguage are required"
}
```

---

### 2. Get Supported Languages

**Endpoint:** `GET /api/translate/languages`

**Response:**
```json
{
  "success": true,
  "languages": [
    { "code": "en", "name": "English" },
    { "code": "es", "name": "Spanish" },
    { "code": "fr", "name": "French" },
    { "code": "de", "name": "German" },
    { "code": "zh", "name": "Chinese" }
  ]
}
```

---

### 3. Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok",
  "message": "Translation API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🍎 Swift Integration Guide

### Example: Translate a Word from Swift

```swift
import Foundation

struct TranslationRequest: Codable {
    let word: String
    let targetLanguage: String
    let sourceLanguage: String?
}

struct TranslationResponse: Codable {
    let success: Bool
    let data: TranslationData?
    let error: String?
}

struct TranslationData: Codable {
    let originalWord: String
    let translatedWord: String
    let sourceLanguage: String
    let targetLanguage: String
}

class TranslationAPI {
    // Change this to your computer's IP address when testing on a real device
    // Or use your deployed backend URL in production
    static let baseURL = "http://localhost:3000"

    static func translate(word: String, to targetLanguage: String, completion: @escaping (Result<TranslationData, Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/api/translate") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0)))
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let requestBody = TranslationRequest(
            word: word,
            targetLanguage: targetLanguage,
            sourceLanguage: "auto"
        )

        do {
            request.httpBody = try JSONEncoder().encode(requestBody)
        } catch {
            completion(.failure(error))
            return
        }

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(NSError(domain: "No data", code: 0)))
                return
            }

            do {
                let response = try JSONDecoder().decode(TranslationResponse.self, from: data)
                if response.success, let translationData = response.data {
                    completion(.success(translationData))
                } else {
                    let errorMessage = response.error ?? "Unknown error"
                    completion(.failure(NSError(domain: errorMessage, code: 0)))
                }
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
}

// Usage Example:
TranslationAPI.translate(word: "hello", to: "es") { result in
    switch result {
    case .success(let data):
        print("Translation: \(data.translatedWord)")
        // Update UI on main thread
        DispatchQueue.main.async {
            // Update your UI here
        }
    case .failure(let error):
        print("Error: \(error.localizedDescription)")
    }
}
```

---

## 🌐 Language Codes

Common language codes supported:

| Code | Language |
|------|----------|
| `en` | English |
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `it` | Italian |
| `pt` | Portuguese |
| `ru` | Russian |
| `ja` | Japanese |
| `ko` | Korean |
| `zh` | Chinese |
| `ar` | Arabic |
| `hi` | Hindi |

For a complete list, call the `/api/translate/languages` endpoint.

---

## 🔧 Configuration

Edit the `.env` file to configure:

```env
PORT=3000
NODE_ENV=development
LIBRETRANSLATE_URL=https://libretranslate.com
```

---

## 📱 Testing with Swift Frontend

### Option 1: Same Computer (Simulator)
- Backend: `http://localhost:3000`
- Swift app can connect directly to `localhost`

### Option 2: Real iOS Device (Same Network)
1. Find your computer's IP address:
   ```bash
   # On Mac:
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
2. Update Swift code to use your IP:
   ```swift
   static let baseURL = "http://192.168.1.XXX:3000"
   ```
3. Make sure both devices are on the same WiFi network

### Option 3: Production Deployment
Deploy your backend to:
- **Heroku**: Free tier available
- **Railway**: Easy deployment
- **Render**: Free tier available
- **AWS/Google Cloud**: More advanced

Then update Swift code:
```swift
static let baseURL = "https://your-api.herokuapp.com"
```

---

## 🛠️ Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Main server file
│   ├── types/
│   │   └── translation.types.ts # TypeScript interfaces
│   ├── routes/
│   │   └── translation.routes.ts # API routes
│   ├── controllers/
│   │   └── translation.controller.ts # Request handlers
│   └── services/
│       └── translation.service.ts # Translation logic
├── package.json
├── tsconfig.json
└── .env
```

---

## 🔍 Translation Service

Currently using **LibreTranslate** - a free, open-source translation API.

### Alternatives:

1. **Google Cloud Translation API** (Paid, high quality)
   - Sign up at Google Cloud
   - Add API key to `.env`
   - Update `translation.service.ts`

2. **DeepL API** (Paid, very high quality)
   - Better translations than Google for European languages

3. **Self-hosted LibreTranslate** (Free, requires setup)
   - More reliable than public instance
   - Full control over data

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### CORS errors from Swift
- Make sure CORS is enabled (already configured)
- Check that you're using the correct URL

### Translation not working
- Check internet connection
- LibreTranslate public instance might be slow/down
- Consider using a different translation service

---

## 📝 Notes for Your Teammate

1. **Base URL**: Update `baseURL` in Swift code to match where the backend is running
2. **Error Handling**: Always check the `success` field in responses
3. **Language Codes**: Use 2-letter ISO codes (en, es, fr, etc.)
4. **Auto-detection**: Set `sourceLanguage` to "auto" to auto-detect the source language
5. **Timeout**: Translations might take 1-3 seconds depending on the service

---

## 📄 License

ISC
