# iOS Integration Guide — Translation API

**For the frontend developer: one guide to connect the app to the backend.**

No backend experience needed. Follow the steps in order.

---

## What you need from the backend teammate

1. **The API base URL**  
   Example: `https://your-app-name.onrender.com`  
   Ask for the real URL once the backend is deployed.

2. **A quick check that it works**  
   Open this in Safari (replace with your URL):  
   `https://your-app-name.onrender.com/health`  
   You should see something like: `{"status":"healthy",...}`  
   If you see that, the API is running.

---

## Step 1 — Add the API helper file (about 5 minutes)

### 1.1 Create the file in Xcode

- In Xcode: **File → New → File…**
- Choose **Swift File**
- Name it: **TranslationAPI**
- Save it in your app target (e.g. next to your views).

### 1.2 Paste the code

Open the file **TranslationAPI.swift** and replace everything in it with the code below.

**Before you run the app:** find this line near the top of the class:

```swift
static let baseURL = "https://ece496-translation-api.onrender.com"
```

Replace `https://ece496-translation-api.onrender.com` with the **actual API URL** your backend teammate gave you.  
That’s the only change you must make in this file.

---

### TranslationAPI.swift (copy everything below)

```swift
import Foundation

// MARK: - Request / Response Types
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
    let alternatives: [Alternative]?
    let frenchGrammar: FrenchGrammar?
    let timestamp: String
}

struct Alternative: Codable {
    let translation: String
    let quality: String
    let source: String
}

struct FrenchGrammar: Codable {
    let gender: String?
    let plural: String?
    let source: String?
    let confidence: String?
}

struct TranslationWithExampleResponse: Codable {
    let success: Bool
    let original: String
    let translated: String
    let targetLanguage: String
    let frenchGrammar: FrenchGrammar?
    let exampleSentences: [ExampleSentence]?
    let exampleSentence: ExampleSentence?
    let confidence: Double
    let timestamp: String
}

struct ExampleSentence: Codable {
    let original: String
    let translated: String
    let source: String
}

struct Language: Codable {
    let code: String
    let name: String
}

struct LanguagesResponse: Codable {
    let success: Bool
    let languages: [Language]
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

struct HealthResponse: Codable {
    let status: String
    let timestamp: String
    let uptime: Double
}

// MARK: - API Service
class TranslationAPI {
    // ⚠️ REPLACE with the real API URL from your backend teammate
    static let baseURL = "https://ece496-translation-api.onrender.com"

    // Translate a word and get 3–5 example sentences (recommended for learning)
    static func translateWithExample(
        word: String,
        to language: String,
        completion: @escaping (Result<TranslationWithExampleResponse, Error>) -> Void
    ) {
        guard let url = URL(string: "\(baseURL)/api/translate-with-example") else {
            completion(.failure(NSError(domain: "Invalid URL", code: -1)))
            return
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let body = TranslationRequest(word: word, targetLanguage: language)
        do {
            request.httpBody = try JSONEncoder().encode(body)
        } catch {
            completion(.failure(error))
            return
        }
        URLSession.shared.dataTask(with: request) { data, _, error in
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

    // Translate a single word (no examples)
    static func translate(
        word: String,
        to language: String,
        completion: @escaping (Result<TranslationResponse, Error>) -> Void
    ) {
        guard let url = URL(string: "\(baseURL)/api/translate") else {
            completion(.failure(NSError(domain: "Invalid URL", code: -1)))
            return
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        let body = TranslationRequest(word: word, targetLanguage: language)
        do {
            request.httpBody = try JSONEncoder().encode(body)
        } catch {
            completion(.failure(error))
            return
        }
        URLSession.shared.dataTask(with: request) { data, _, error in
            if let error = error { completion(.failure(error)); return }
            guard let data = data else {
                completion(.failure(NSError(domain: "No data received", code: -1)))
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

    // Get pronunciation audio URL (play with AVPlayer)
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
        let body: [String: String] = ["word": word, "language": language]
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body)
        } catch {
            completion(.failure(error))
            return
        }
        URLSession.shared.dataTask(with: request) { data, _, error in
            if let error = error { completion(.failure(error)); return }
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

    // Get list of supported languages
    static func getLanguages(completion: @escaping (Result<LanguagesResponse, Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/api/languages") else {
            completion(.failure(NSError(domain: "Invalid URL", code: -1)))
            return
        }
        URLSession.shared.dataTask(with: url) { data, _, error in
            if let error = error { completion(.failure(error)); return }
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

    // Check if the API is reachable
    static func checkHealth(completion: @escaping (Result<HealthResponse, Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/health") else {
            completion(.failure(NSError(domain: "Invalid URL", code: -1)))
            return
        }
        URLSession.shared.dataTask(with: url) { data, _, error in
            if let error = error { completion(.failure(error)); return }
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

## Step 2 — Use it in your app

### Translate a word and show 3–5 example sentences (recommended)

Use this when the user looks up a word and you want translation + example sentences:

```swift
TranslationAPI.translateWithExample(word: "hello", to: "es") { result in
    switch result {
    case .success(let translation):
        // Translated word
        let word = translation.translated  // e.g. "hola"

        // 3–5 example sentences
        let examples = translation.exampleSentences ?? []
        // Each has: .original (English), .translated (target language), .source

        // Update UI on the main thread
        DispatchQueue.main.async {
            // e.g. update labels or a list with word and examples
        }

    case .failure(let error):
        DispatchQueue.main.async {
            // Show error to user (e.g. alert or message)
        }
    }
}
```

- **Word:** use `translation.translated`.  
- **Examples:** use `translation.exampleSentences` (array of 3–5 items).  
- **UI:** do all label/list updates inside `DispatchQueue.main.async { }`.

### French-only grammar info (gender + plural)

When `targetLanguage == "fr"`, backend may include:
- `translation.frenchGrammar?.gender` (e.g. `"masculine"` or `"feminine"`)
- `translation.frenchGrammar?.plural` (e.g. `"livres"`)
- `translation.frenchGrammar?.source` (`"wiktionary"` or `"heuristic"`)
- `translation.frenchGrammar?.confidence` (`"low"` or `"medium"`)

Use it like this:

```swift
if translation.targetLanguage == "fr", let fg = translation.frenchGrammar {
    let genderText = fg.gender ?? "—"
    let pluralText = fg.plural ?? "—"
    let sourceText = fg.source ?? "unknown"

    DispatchQueue.main.async {
        // Example UI labels:
        // frenchGenderLabel.text = "Gender: \(genderText)"
        // frenchPluralLabel.text = "Plural: \(pluralText)"
        // frenchMetaLabel.text = "Source: \(sourceText)"
    }
}
```

If language is not French, `frenchGrammar` is usually `nil` (ignore it).

### Optional: SwiftUI French grammar card (ready to paste)

Use this small component to show French grammar metadata only when available:

```swift
import SwiftUI

struct FrenchGrammarCard: View {
    let grammar: FrenchGrammar?
    let targetLanguage: String

    var body: some View {
        // Show only for French and when backend sent grammar data
        if targetLanguage == "fr", let grammar {
            VStack(alignment: .leading, spacing: 6) {
                Text("French Grammar")
                    .font(.headline)

                Text("Gender: \(grammar.gender ?? "—")")
                Text("Plural: \(grammar.plural ?? "—")")

                // Optional meta info for debugging/transparency
                Text("Source: \(grammar.source ?? "unknown")")
                    .font(.caption)
                    .foregroundColor(.secondary)
                Text("Confidence: \(grammar.confidence ?? "low")")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding(12)
            .background(Color.orange.opacity(0.12))
            .cornerRadius(10)
        }
    }
}
```

Example usage inside your view:

```swift
FrenchGrammarCard(
    grammar: translation.frenchGrammar,
    targetLanguage: translation.targetLanguage
)
```

---

### Play pronunciation

You need to play the **translated** word in the **target** language (e.g. "hola" for Spanish). Get the URL from the API, then play it with `AVPlayer`:

```swift
import AVFoundation

// wordToSpeak: the translated word (e.g. "hola")
// languageCode: same code you used for translation (e.g. "es")
TranslationAPI.getPronunciation(word: wordToSpeak, language: languageCode) { result in
    switch result {
    case .success(let pronunciation):
        guard let url = URL(string: pronunciation.audioUrl) else { return }
        DispatchQueue.main.async {
            let player = AVPlayer(url: url)
            player.play()
        }
    case .failure(let error):
        // Handle error (e.g. show message)
        break
    }
}
```

---

### Get the list of languages (for a picker)

Call once (e.g. when the screen loads) and fill your language picker:

```swift
TranslationAPI.getLanguages { result in
    switch result {
    case .success(let response):
        let languages = response.languages  // [{ code: "es", name: "Spanish" }, ...]
        DispatchQueue.main.async {
            // Use languages for your Picker or list
        }
    case .failure(let error):
        // Handle error
        break
    }
}
```

---

## Step 3 — Things to avoid

1. **Don’t update UI outside the main thread**  
   Always wrap UI updates in `DispatchQueue.main.async { ... }` when you’re inside the completion handler.

2. **Don’t skip error handling**  
   Always use `switch result` and handle `.failure`. Show a simple message or alert so the user knows when something went wrong.

3. **Don’t forget to set the API URL**  
   If you don’t replace `baseURL` in `TranslationAPI.swift`, requests will go to the wrong server or fail.

---

## If something goes wrong

| What you see | What to do |
|--------------|------------|
| “Invalid URL” or request fails | Check that `TranslationAPI.baseURL` is the exact URL from your backend teammate (including `https://`). |
| “No data received” | 1) Open `https://YOUR-URL/health` in Safari. 2) If it doesn’t load, the backend might be down or the URL wrong. 3) Check device has internet. |
| App crashes when you translate | Make sure you’re using `switch result` and handling both `.success` and `.failure`. |
| Labels don’t update after translation | Put all UI updates inside `DispatchQueue.main.async { ... }`. |

---

## Quick reference

- **Base URL:** set once in `TranslationAPI.swift` as `baseURL`.
- **Translate + examples:** `TranslationAPI.translateWithExample(word:to:completion:)`  
  → Use `translation.translated`, `translation.exampleSentences`, and for French also `translation.frenchGrammar`.
- **Translate (simple):** `TranslationAPI.translate(word:to:completion:)`  
  → For French targets, also check `translation.frenchGrammar`.
- **Pronunciation:** `TranslationAPI.getPronunciation(word:language:completion:)`  
  → Use `pronunciation.audioUrl` with `AVPlayer`.
- **Languages list:** `TranslationAPI.getLanguages(completion:)`  
  → Use `response.languages` for your picker.
- **Check API:** `TranslationAPI.checkHealth(completion:)`  
  → Optional; useful for debugging.

---

## Supported language codes (for picker / API)

| Code   | Language |
|--------|----------|
| `es`   | Spanish  |
| `fr`   | French   |
| `de`   | German   |
| `it`   | Italian  |
| `pt`   | Portuguese |
| `ru`   | Russian  |
| `ja`   | Japanese |
| `ko`   | Korean   |
| `zh-CN`| Chinese (Simplified) |
| `zh-TW`| Chinese (Traditional) |
| `ar`   | Arabic   |
| `hi`   | Hindi    |
| `nl`   | Dutch    |
| `pl`   | Polish   |
| `tr`   | Turkish  |

---

That’s all you need in one place. If the backend URL is correct and you use the completion handlers and main thread as above, the integration should work. For more details (e.g. full SwiftUI sample), ask your backend teammate or check the repo’s other docs.
