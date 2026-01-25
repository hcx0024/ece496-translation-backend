# 📱 Swift Integration Guide - Translation API

**For Swift Developers with No Backend Experience**

This guide will teach you how to use the translation API from your Swift app, step by step.

---

## ⚡ Quick Start (5 Minutes)

### ✅ Checklist

- [ ] **Step 1:** Test API is working (30 seconds)
  - Open `https://your-api-url.onrender.com/health` in browser
  - Should see `{"status":"healthy"}` ✅

- [ ] **Step 2:** Copy Swift code (2 minutes)
  - Scroll to "🍎 Swift Code - Copy & Paste Ready!" section
  - Copy the entire `TranslationAPI.swift` code block
  - Create new Swift file in Xcode: `File → New → File → Swift File`
  - Name it `TranslationAPI.swift` and paste the code

- [ ] **Step 3:** Update API URL (30 seconds)
  - In `TranslationAPI.swift`, find line: `static let baseURL = "https://ece496-translation-api.onrender.com"`
  - Replace with your actual Render URL (your teammate will provide this)

- [ ] **Step 4:** Use it in your app! (2 minutes)
  - Copy any example from "🎯 How to Use in Your Swift App" section
  - Paste into your SwiftUI view or ViewController
  - Run the app and test!

**That's it!** You're ready to translate words, get multiple examples, and play pronunciations.

---

## 🎁 What You'll Get

After following this guide, you'll be able to:

✅ **Translate words** to 15+ languages  
✅ **Get 3-5 example sentences** per word (shows real usage!)  
✅ **Play pronunciation audio** (native speaker quality)  
✅ **Handle errors gracefully** (network issues, invalid words, etc.)  
✅ **Use in SwiftUI or UIKit** (complete examples provided)

**No backend knowledge required!** Just copy, paste, and customize.

---

## 🌐 What is This API?

Think of the API as a translator service running on the internet. You send it:
- A word you want to translate
- The language you want it translated to

It sends back:
- The translated word
- **3-5 example sentences** (NEW! ⭐)
- Confidence score
- Alternative translations
- Pronunciation audio URL

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

> **💡 Tip:** You don't need to understand all endpoints. Just use the examples below - they work out of the box!

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

### 3. Translate Word with Multiple Example Sentences (RECOMMENDED! ⭐)
**What it does:** Translates a word AND provides 3-5 example sentences in the target language

**URL:** `POST /api/translate-with-example`

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
  "exampleSentences": [
    {
      "original": "Hello, everyone.",
      "translated": "Hola a todos.",
      "source": "dictionary"
    },
    {
      "original": "Hello? Is anyone there?",
      "translated": "Hola, ¿hay alguien ahí?",
      "source": "dictionary"
    },
    {
      "original": "Hello! What's going on here?",
      "translated": "¡Hola! ¿Qué está pasando aquí?",
      "source": "dictionary"
    }
  ],
  "exampleSentence": {
    "original": "Hello, everyone.",
    "translated": "Hola a todos.",
    "source": "dictionary"
  },
  "confidence": 1,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**How it works:**
1. Gets 3-5 English example sentences from a real dictionary (or generates contextual ones)
2. Translates the word to your target language
3. Translates all example sentences to your target language
4. Returns the word and multiple example sentences in the target language!

**Note:** The response includes:
- `exampleSentences` (array) - **NEW!** Contains 3-5 example sentences
- `exampleSentence` (object) - **Backward compatible** - Contains the first example for compatibility

---

### 4. Get Pronunciation Audio URL (NEW! 🔊)
**What it does:** Gets an audio URL to play pronunciation of a word in any language

**URL:** `POST /api/pronunciation`

**You need to send:**
```json
{
  "word": "hola",
  "language": "es"
}
```

**You will receive:**
```json
{
  "success": true,
  "word": "hola",
  "language": "es",
  "audioUrl": "https://translate.google.com/translate_tts?...",
  "format": "mp3",
  "source": "Google Translate TTS",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**How to use in Swift:**
1. Call the API to get the `audioUrl`
2. Use `AVPlayer` to play the audio URL
3. The audio will pronounce the word in the specified language!

---

### 5. Get Supported Languages
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

struct TranslationWithExampleResponse: Codable {
    let success: Bool
    let original: String
    let translated: String
    let targetLanguage: String
    let exampleSentences: [ExampleSentence]? // NEW! Array of 3-5 examples
    let exampleSentence: ExampleSentence? // Backward compatible - first example
    let confidence: Double
    let timestamp: String
}

struct ExampleSentence: Codable {
    let original: String
    let translated: String
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

struct PronunciationRequest: Codable {
    let word: String
    let language: String
}

struct PronunciationResponse: Codable {
    let success: Bool
    let word: String
    let language: String
    let audioUrl: String
    let format: String
    let source: String
    let timestamp: String
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

    // MARK: - Translate Word with Multiple Example Sentences (NEW!)
    static func translateWithExample(
        word: String,
        to language: String,
        completion: @escaping (Result<TranslationWithExampleResponse, Error>) -> Void
    ) {
        // Create URL
        guard let url = URL(string: "\(baseURL)/api/translate-with-example") else {
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
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(NSError(domain: "No data received", code: -1)))
                return
            }

            do {
                let result = try JSONDecoder().decode(TranslationWithExampleResponse.self, from: data)
                completion(.success(result))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    // MARK: - Get Pronunciation Audio URL
    static func getPronunciation(
        word: String,
        language: String,
        completion: @escaping (Result<PronunciationResponse, Error>) -> Void
    ) {
        guard let url = URL(string: "\(baseURL)/api/pronunciation") else {
            completion(.failure(NSError(domain: "Invalid URL", code: -1)))
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let body = PronunciationRequest(word: word, language: language)

        do {
            request.httpBody = try JSONEncoder().encode(body)
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
                completion(.failure(NSError(domain: "No data received", code: -1)))
                return
            }

            do {
                let result = try JSONDecoder().decode(PronunciationResponse.self, from: data)
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

### Example 1: Translate a Word with Multiple Example Sentences (RECOMMENDED! ⭐)

```swift
// Translate "hello" to Spanish with multiple example sentences
TranslationAPI.translateWithExample(word: "hello", to: "es") { result in
    switch result {
    case .success(let translation):
        print("Original: \(translation.original)")
        print("Translated: \(translation.translated)")
        
        // NEW! Access multiple example sentences
        if let examples = translation.exampleSentences {
            print("Found \(examples.count) example sentences:")
            for (index, example) in examples.enumerated() {
                print("  \(index + 1). \(example.original) → \(example.translated)")
            }
            
            // Update your UI on the main thread
            DispatchQueue.main.async {
                // Show first example
                // wordLabel.text = translation.translated
                // exampleLabel.text = examples[0].translated
                
                // Or show all examples in a scrollable list
                // examplesListView.examples = examples
            }
        } else if let singleExample = translation.exampleSentence {
            // Backward compatibility - use single example if array not available
            print("Example: \(singleExample.original) → \(singleExample.translated)")
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

### Example 2: Translate Just a Word (Simple)

```swift
// Translate "hello" to Spanish (without example)
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

### Example 3: Get All Languages

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

### Example 4: Get Pronunciation Audio URL (NEW! 🔊)

```swift
import AVFoundation

// Get pronunciation audio URL for "hola" in Spanish
TranslationAPI.getPronunciation(word: "hola", language: "es") { result in
    switch result {
    case .success(let pronunciation):
        print("Audio URL: \(pronunciation.audioUrl)")
        
        // Play the audio using AVPlayer
        DispatchQueue.main.async {
            guard let url = URL(string: pronunciation.audioUrl) else { return }
            let player = AVPlayer(url: url)
            player.play()
            
            // Or use AVAudioPlayer for more control
            // let player = AVAudioPlayer()
            // player.play()
        }
        
    case .failure(let error):
        print("Failed to get pronunciation: \(error.localizedDescription)")
    }
}
```

**Complete example with AVPlayer:**
```swift
import AVFoundation

class PronunciationPlayer {
    private var player: AVPlayer?
    
    func playPronunciation(word: String, language: String) {
        TranslationAPI.getPronunciation(word: word, language: language) { [weak self] result in
            switch result {
            case .success(let pronunciation):
                guard let audioURL = URL(string: pronunciation.audioUrl) else {
                    print("Invalid audio URL")
                    return
                }
                
                DispatchQueue.main.async {
                    self?.player = AVPlayer(url: audioURL)
                    self?.player?.play()
                }
                
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
            }
        }
    }
}

// Usage:
let pronunciationPlayer = PronunciationPlayer()
pronunciationPlayer.playPronunciation(word: "hola", language: "es")
```

---

### Example 5: Check if API is Working

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
import AVFoundation

struct TranslationView: View {
    @State private var inputWord = ""
    @State private var translatedWord = ""
    @State private var exampleSentences: [ExampleSentence] = [] // NEW! Multiple examples
    @State private var selectedLanguage = "es"
    @State private var isLoading = false
    @State private var errorMessage = ""
    @State private var player: AVPlayer?

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
                VStack(alignment: .leading, spacing: 15) {
                    // Translated word with pronunciation button
                    HStack {
                        VStack(alignment: .leading, spacing: 5) {
                            Text("Translation:")
                                .font(.headline)
                            Text(translatedWord)
                                .font(.title)
                                .bold()
                                .foregroundColor(.green)
                        }
                        
                        Spacer()
                        
                        // Pronunciation button
                        Button(action: playPronunciation) {
                            Image(systemName: "speaker.wave.2.fill")
                                .font(.title2)
                                .foregroundColor(.blue)
                                .padding(10)
                                .background(Color.blue.opacity(0.1))
                                .clipShape(Circle())
                        }
                    }

                    // Multiple Example Sentences (NEW! ⭐)
                    if !exampleSentences.isEmpty {
                        Divider()
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Example Sentences (\(exampleSentences.count)):")
                                .font(.headline)
                            
                            // Scrollable list of examples
                            ScrollView {
                                VStack(alignment: .leading, spacing: 8) {
                                    ForEach(Array(exampleSentences.enumerated()), id: \.offset) { index, example in
                                        VStack(alignment: .leading, spacing: 4) {
                                            Text("\(index + 1). \(example.original)")
                                                .font(.caption)
                                                .foregroundColor(.gray)
                                            Text(example.translated)
                                                .font(.body)
                                                .foregroundColor(.blue)
                                        }
                                        .padding(.vertical, 4)
                                        .padding(.horizontal, 8)
                                        .background(Color.blue.opacity(0.05))
                                        .cornerRadius(5)
                                    }
                                }
                            }
                            .frame(maxHeight: 200) // Limit height for scrolling
                        }
                    }
                }
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
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
        exampleSentences = []

        // Use the new endpoint with multiple example sentences!
        TranslationAPI.translateWithExample(word: inputWord, to: selectedLanguage) { result in
            DispatchQueue.main.async {
                isLoading = false

                switch result {
                case .success(let translation):
                    translatedWord = translation.translated
                    
                    // NEW! Get all example sentences (3-5 examples)
                    if let examples = translation.exampleSentences, !examples.isEmpty {
                        exampleSentences = examples
                    } else if let singleExample = translation.exampleSentence {
                        // Backward compatibility - convert single to array
                        exampleSentences = [singleExample]
                    }

                case .failure(let error):
                    errorMessage = "Error: \(error.localizedDescription)"
                }
            }
        }
    }
    
    func playPronunciation() {
        // Play pronunciation of the translated word
        TranslationAPI.getPronunciation(word: translatedWord, language: selectedLanguage) { result in
            switch result {
            case .success(let pronunciation):
                guard let audioURL = URL(string: pronunciation.audioUrl) else { return }
                DispatchQueue.main.async {
                    self.player = AVPlayer(url: audioURL)
                    self.player?.play()
                }
            case .failure(let error):
                print("Pronunciation error: \(error.localizedDescription)")
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
- [ ] **Multiple example sentences appear** (should see 3-5 examples)
- [ ] Can get list of supported languages
- [ ] Pronunciation audio plays when button is tapped
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

**Translate with Multiple Examples (RECOMMENDED):** `POST /api/translate-with-example`
```json
{ "word": "hello", "targetLanguage": "es" }
```
Returns: word + 3-5 example sentences in target language

**Translate (Simple):** `POST /api/translate`
```json
{ "word": "hello", "targetLanguage": "es" }
```
Returns: just the translated word

**Get Pronunciation Audio (NEW! 🔊):** `POST /api/pronunciation`
```json
{ "word": "hola", "language": "es" }
```
Returns: audio URL to play pronunciation

**Languages:** `GET /api/languages`

**Health:** `GET /health`

---

**Good luck! 🚀**
