# 📱 Swift Integration Guide - Translation API

**For Swift Developers with No Backend Experience**

This guide will teach you how to use the translation API from your Swift app, step by step.

---

## 🌐 What is This API?

Think of the API as a translator service running on the internet. You send it:
- A word you want to translate
- The language you want it translated to

It sends back:
- The translated word
- Confidence score
- Alternative translations

---

## 📍 API URL

**Production URL:** `https://ece496-translation-api.onrender.com`

*(Replace with your actual Render URL once deployed)*

---

## 🧪 Test the API First (No Code Required!)

Before writing any Swift code, let's make sure the API works.

### Option 1: Test in Your Browser

Open this URL in Safari or Chrome:
```
https://ece496-translation-api.onrender.com/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

✅ If you see this, the API is working!

### Option 2: Test with Terminal (Mac)

Open Terminal and run:
```bash
curl https://ece496-translation-api.onrender.com/health
```

### Option 3: Test Translation

```bash
curl -X POST https://ece496-translation-api.onrender.com/api/translate \
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
  "confidence": 1,
  "alternatives": [...],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 📚 Available API Endpoints

### 1. Health Check
**What it does:** Checks if the API is running

**URL:** `GET /health`

**No parameters needed**

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.45
}
```

---

### 2. Translate Word
**What it does:** Translates a word to another language

**URL:** `POST /api/translate`

**You need to send:**
```json
{
  "word": "hello",
  "targetLanguage": "es"
}
```

**You will receive:**
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

---

### 3. Get Supported Languages
**What it does:** Shows all languages you can translate to

**URL:** `GET /api/languages`

**No parameters needed**

**Response:**
```json
{
  "success": true,
  "languages": [
    { "code": "es", "name": "Spanish" },
    { "code": "fr", "name": "French" },
    { "code": "de", "name": "German" },
    ...
  ]
}
```

---

## 🍎 Swift Code - Copy & Paste Ready!

### Step 1: Create the API Models

Create a new Swift file called `TranslationAPI.swift` and paste this:

```swift
import Foundation

// MARK: - Request Model
struct TranslationRequest: Codable {
    let word: String
    let targetLanguage: String
}

// MARK: - Response Models
struct TranslationResponse: Codable {
    let success: Bool
    let original: String
    let translated: String
    let targetLanguage: String
    let confidence: Double
    let alternatives: [Alternative]?
    let timestamp: String
}

struct Alternative: Codable {
    let translation: String
    let quality: String
    let source: String
}

struct LanguagesResponse: Codable {
    let success: Bool
    let languages: [Language]
}

struct Language: Codable {
    let code: String
    let name: String
}

struct HealthResponse: Codable {
    let status: String
    let timestamp: String
    let uptime: Double
}

// MARK: - API Service
class TranslationAPI {
    // ⚠️ IMPORTANT: Replace with your actual Render URL
    static let baseURL = "https://ece496-translation-api.onrender.com"

    // MARK: - Translate Word
    static func translate(
        word: String,
        to language: String,
        completion: @escaping (Result<TranslationResponse, Error>) -> Void
    ) {
        // Create URL
        guard let url = URL(string: "\(baseURL)/api/translate") else {
            completion(.failure(NSError(domain: "Invalid URL", code: -1)))
            return
        }

        // Create request
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // Create request body
        let body = TranslationRequest(word: word, targetLanguage: language)

        do {
            request.httpBody = try JSONEncoder().encode(body)
        } catch {
            completion(.failure(error))
            return
        }

        // Send request
        URLSession.shared.dataTask(with: request) { data, response, error in
            // Check for errors
            if let error = error {
                completion(.failure(error))
                return
            }

            // Check for data
            guard let data = data else {
                completion(.failure(NSError(domain: "No data received", code: -1)))
                return
            }

            // Parse response
            do {
                let result = try JSONDecoder().decode(TranslationResponse.self, from: data)
                completion(.success(result))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    // MARK: - Get Supported Languages
    static func getSupportedLanguages(
        completion: @escaping (Result<LanguagesResponse, Error>) -> Void
    ) {
        guard let url = URL(string: "\(baseURL)/api/languages") else {
            completion(.failure(NSError(domain: "Invalid URL", code: -1)))
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(NSError(domain: "No data received", code: -1)))
                return
            }

            do {
                let result = try JSONDecoder().decode(LanguagesResponse.self, from: data)
                completion(.success(result))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    // MARK: - Health Check
    static func checkHealth(
        completion: @escaping (Result<HealthResponse, Error>) -> Void
    ) {
        guard let url = URL(string: "\(baseURL)/health") else {
            completion(.failure(NSError(domain: "Invalid URL", code: -1)))
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(NSError(domain: "No data received", code: -1)))
                return
            }

            do {
                let result = try JSONDecoder().decode(HealthResponse.self, from: data)
                completion(.success(result))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }
}
```

---

## 🎯 How to Use in Your Swift App

### Example 1: Translate a Word

```swift
// Translate "hello" to Spanish
TranslationAPI.translate(word: "hello", to: "es") { result in
    switch result {
    case .success(let translation):
        print("Original: \(translation.original)")
        print("Translated: \(translation.translated)")
        print("Language: \(translation.targetLanguage)")
        print("Confidence: \(translation.confidence)")

        // Update your UI on the main thread
        DispatchQueue.main.async {
            // Update your labels, text fields, etc.
            // yourLabel.text = translation.translated
        }

    case .failure(let error):
        print("Translation failed: \(error.localizedDescription)")

        // Show error to user
        DispatchQueue.main.async {
            // Show alert or error message
        }
    }
}
```

### Example 2: Get All Languages

```swift
TranslationAPI.getSupportedLanguages { result in
    switch result {
    case .success(let response):
        print("Supported languages:")
        for language in response.languages {
            print("- \(language.name) (\(language.code))")
        }

        // Update your UI
        DispatchQueue.main.async {
            // Populate your picker/dropdown with languages
        }

    case .failure(let error):
        print("Failed to get languages: \(error.localizedDescription)")
    }
}
```

### Example 3: Check if API is Working

```swift
TranslationAPI.checkHealth { result in
    switch result {
    case .success(let health):
        print("API Status: \(health.status)")
        print("API is working! ✅")

    case .failure(let error):
        print("API is down: \(error.localizedDescription)")
        print("Check your internet connection or API URL")
    }
}
```

---

## 🎨 SwiftUI Example

Here's a complete SwiftUI view you can use:

```swift
import SwiftUI

struct TranslationView: View {
    @State private var inputWord = ""
    @State private var translatedWord = ""
    @State private var selectedLanguage = "es"
    @State private var isLoading = false
    @State private var errorMessage = ""

    let languages = [
        ("es", "Spanish"),
        ("fr", "French"),
        ("de", "German"),
        ("it", "Italian"),
        ("ja", "Japanese"),
        ("ko", "Korean"),
        ("zh-CN", "Chinese")
    ]

    var body: some View {
        VStack(spacing: 20) {
            Text("Translation App")
                .font(.largeTitle)
                .bold()

            // Input field
            TextField("Enter word to translate", text: $inputWord)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()

            // Language picker
            Picker("Target Language", selection: $selectedLanguage) {
                ForEach(languages, id: \.0) { code, name in
                    Text(name).tag(code)
                }
            }
            .pickerStyle(MenuPickerStyle())
            .padding()

            // Translate button
            Button(action: translateWord) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle())
                } else {
                    Text("Translate")
                        .bold()
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(10)
                }
            }
            .disabled(inputWord.isEmpty || isLoading)
            .padding()

            // Result
            if !translatedWord.isEmpty {
                VStack(alignment: .leading, spacing: 10) {
                    Text("Translation:")
                        .font(.headline)
                    Text(translatedWord)
                        .font(.title)
                        .bold()
                        .foregroundColor(.green)
                }
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color.green.opacity(0.1))
                .cornerRadius(10)
                .padding()
            }

            // Error message
            if !errorMessage.isEmpty {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .padding()
            }

            Spacer()
        }
        .padding()
    }

    func translateWord() {
        isLoading = true
        errorMessage = ""
        translatedWord = ""

        TranslationAPI.translate(word: inputWord, to: selectedLanguage) { result in
            DispatchQueue.main.async {
                isLoading = false

                switch result {
                case .success(let translation):
                    translatedWord = translation.translated

                case .failure(let error):
                    errorMessage = "Error: \(error.localizedDescription)"
                }
            }
        }
    }
}

struct TranslationView_Previews: PreviewProvider {
    static var previews: some View {
        TranslationView()
    }
}
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Invalid URL" Error
**Problem:** The API URL is wrong

**Solution:** Make sure you updated this line in `TranslationAPI.swift`:
```swift
static let baseURL = "https://ece496-translation-api.onrender.com"
```
Replace with your actual Render URL!

---

### Issue 2: "No data received" Error
**Problem:** API is not responding

**Solution:**
1. Check if API is running: Open `https://your-url.onrender.com/health` in browser
2. Check your internet connection
3. Make sure Render service is deployed and active

---

### Issue 3: App crashes when translating
**Problem:** Not handling errors properly

**Solution:** Always use the `switch result` pattern shown in examples above

---

### Issue 4: UI doesn't update
**Problem:** Forgot to use `DispatchQueue.main.async`

**Solution:** Always update UI on main thread:
```swift
DispatchQueue.main.async {
    // Update your UI here
}
```

---

## 📋 Supported Language Codes

| Code | Language |
|------|----------|
| `es` | Spanish |
| `fr` | French |
| `de` | German |
| `it` | Italian |
| `pt` | Portuguese |
| `ru` | Russian |
| `ja` | Japanese |
| `ko` | Korean |
| `zh-CN` | Chinese (Simplified) |
| `zh-TW` | Chinese (Traditional) |
| `ar` | Arabic |
| `hi` | Hindi |
| `nl` | Dutch |
| `pl` | Polish |
| `tr` | Turkish |

---

## ✅ Testing Checklist

Before submitting your app, test these:

- [ ] Health check works
- [ ] Can translate a simple word (e.g., "hello" to Spanish)
- [ ] Can get list of supported languages
- [ ] Error handling works (try with no internet)
- [ ] UI updates correctly after translation
- [ ] Loading indicator shows while translating
- [ ] Can translate to different languages

---

## 🆘 Need Help?

1. **Test the API first** - Use browser or Terminal to make sure API works
2. **Check the URL** - Make sure you're using the correct Render URL
3. **Read error messages** - They usually tell you what's wrong
4. **Check Xcode console** - Look for print statements and errors

---

## 📞 Quick Reference

**API Base URL:** `https://ece496-translation-api.onrender.com`

**Translate:** `POST /api/translate`
```json
{ "word": "hello", "targetLanguage": "es" }
```

**Languages:** `GET /api/languages`

**Health:** `GET /health`

---

**Good luck! 🚀**
