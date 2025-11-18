# Swift Integration Guide

Complete guide for your Swift teammate to integrate with the Translation API backend.

---

## 🎯 Quick Setup

### Step 1: Create the API Client

Create a new Swift file called `TranslationAPI.swift` in your project:

```swift
import Foundation

// MARK: - Request/Response Models

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

struct LanguagesResponse: Codable {
    let success: Bool
    let languages: [Language]?
    let error: String?
}

struct Language: Codable {
    let code: String
    let name: String
}

// MARK: - API Client

class TranslationAPI {

    // IMPORTANT: Update this URL based on your setup
    // - Simulator: "http://localhost:3000"
    // - Real device (same network): "http://YOUR_COMPUTER_IP:3000"
    // - Production: "https://your-deployed-api.com"
    static let baseURL = "http://localhost:3000"

    enum APIError: Error {
        case invalidURL
        case noData
        case decodingError
        case serverError(String)
        case networkError(Error)

        var localizedDescription: String {
            switch self {
            case .invalidURL:
                return "Invalid URL"
            case .noData:
                return "No data received from server"
            case .decodingError:
                return "Failed to decode response"
            case .serverError(let message):
                return message
            case .networkError(let error):
                return error.localizedDescription
            }
        }
    }

    // MARK: - Translate Word

    static func translate(
        word: String,
        to targetLanguage: String,
        from sourceLanguage: String = "auto",
        completion: @escaping (Result<TranslationData, APIError>) -> Void
    ) {
        guard let url = URL(string: "\(baseURL)/api/translate") else {
            completion(.failure(.invalidURL))
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let requestBody = TranslationRequest(
            word: word,
            targetLanguage: targetLanguage,
            sourceLanguage: sourceLanguage
        )

        do {
            request.httpBody = try JSONEncoder().encode(requestBody)
        } catch {
            completion(.failure(.networkError(error)))
            return
        }

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(.networkError(error)))
                return
            }

            guard let data = data else {
                completion(.failure(.noData))
                return
            }

            do {
                let response = try JSONDecoder().decode(TranslationResponse.self, from: data)
                if response.success, let translationData = response.data {
                    completion(.success(translationData))
                } else {
                    let errorMessage = response.error ?? "Unknown error"
                    completion(.failure(.serverError(errorMessage)))
                }
            } catch {
                completion(.failure(.decodingError))
            }
        }.resume()
    }

    // MARK: - Get Supported Languages

    static func getSupportedLanguages(
        completion: @escaping (Result<[Language], APIError>) -> Void
    ) {
        guard let url = URL(string: "\(baseURL)/api/translate/languages") else {
            completion(.failure(.invalidURL))
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                completion(.failure(.networkError(error)))
                return
            }

            guard let data = data else {
                completion(.failure(.noData))
                return
            }

            do {
                let response = try JSONDecoder().decode(LanguagesResponse.self, from: data)
                if response.success, let languages = response.languages {
                    completion(.success(languages))
                } else {
                    let errorMessage = response.error ?? "Unknown error"
                    completion(.failure(.serverError(errorMessage)))
                }
            } catch {
                completion(.failure(.decodingError))
            }
        }.resume()
    }

    // MARK: - Health Check

    static func checkHealth(completion: @escaping (Bool) -> Void) {
        guard let url = URL(string: "\(baseURL)/health") else {
            completion(false)
            return
        }

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let httpResponse = response as? HTTPURLResponse,
               httpResponse.statusCode == 200 {
                completion(true)
            } else {
                completion(false)
            }
        }.resume()
    }
}
```

---

## 📱 Usage Examples

### Example 1: Simple Translation

```swift
import SwiftUI

struct TranslationView: View {
    @State private var inputWord = ""
    @State private var translatedWord = ""
    @State private var isLoading = false
    @State private var errorMessage = ""

    var body: some View {
        VStack(spacing: 20) {
            TextField("Enter a word", text: $inputWord)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()

            Button("Translate to Spanish") {
                translateWord()
            }
            .disabled(isLoading || inputWord.isEmpty)

            if isLoading {
                ProgressView()
            }

            if !translatedWord.isEmpty {
                Text("Translation: \(translatedWord)")
                    .font(.title2)
                    .foregroundColor(.green)
            }

            if !errorMessage.isEmpty {
                Text("Error: \(errorMessage)")
                    .foregroundColor(.red)
            }
        }
        .padding()
    }

    func translateWord() {
        isLoading = true
        errorMessage = ""
        translatedWord = ""

        TranslationAPI.translate(word: inputWord, to: "es") { result in
            DispatchQueue.main.async {
                isLoading = false

                switch result {
                case .success(let data):
                    translatedWord = data.translatedWord
                case .failure(let error):
                    errorMessage = error.localizedDescription
                }
            }
        }
    }
}
```

---

### Example 2: Language Picker

```swift
import SwiftUI

struct LanguagePickerView: View {
    @State private var languages: [Language] = []
    @State private var selectedLanguage: Language?
    @State private var inputWord = ""
    @State private var translatedWord = ""

    var body: some View {
        VStack {
            TextField("Enter word", text: $inputWord)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding()

            Picker("Target Language", selection: $selectedLanguage) {
                Text("Select Language").tag(nil as Language?)
                ForEach(languages, id: \.code) { language in
                    Text(language.name).tag(language as Language?)
                }
            }
            .pickerStyle(MenuPickerStyle())

            Button("Translate") {
                if let targetLang = selectedLanguage {
                    translateWord(to: targetLang.code)
                }
            }
            .disabled(inputWord.isEmpty || selectedLanguage == nil)

            if !translatedWord.isEmpty {
                Text(translatedWord)
                    .font(.title)
                    .padding()
            }
        }
        .onAppear {
            loadLanguages()
        }
    }

    func loadLanguages() {
        TranslationAPI.getSupportedLanguages { result in
            DispatchQueue.main.async {
                if case .success(let langs) = result {
                    languages = langs
                }
            }
        }
    }

    func translateWord(to targetLanguage: String) {
        TranslationAPI.translate(word: inputWord, to: targetLanguage) { result in
            DispatchQueue.main.async {
                if case .success(let data) = result {
                    translatedWord = data.translatedWord
                }
            }
        }
    }
}
```

---

### Example 3: Async/Await (iOS 15+)

```swift
// Modern async/await version
extension TranslationAPI {
    static func translate(
        word: String,
        to targetLanguage: String,
        from sourceLanguage: String = "auto"
    ) async throws -> TranslationData {
        guard let url = URL(string: "\(baseURL)/api/translate") else {
            throw APIError.invalidURL
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let requestBody = TranslationRequest(
            word: word,
            targetLanguage: targetLanguage,
            sourceLanguage: sourceLanguage
        )

        request.httpBody = try JSONEncoder().encode(requestBody)

        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(TranslationResponse.self, from: data)

        if response.success, let translationData = response.data {
            return translationData
        } else {
            throw APIError.serverError(response.error ?? "Unknown error")
        }
    }
}

// Usage with async/await
struct ModernTranslationView: View {
    @State private var inputWord = ""
    @State private var translatedWord = ""

    var body: some View {
        VStack {
            TextField("Enter word", text: $inputWord)

            Button("Translate") {
                Task {
                    await translateWord()
                }
            }

            Text(translatedWord)
        }
    }

    func translateWord() async {
        do {
            let result = try await TranslationAPI.translate(word: inputWord, to: "es")
            translatedWord = result.translatedWord
        } catch {
            print("Error: \(error)")
        }
    }
}
```

---

## 🔧 Configuration

### For Simulator Testing
```swift
static let baseURL = "http://localhost:3000"
```

### For Real Device Testing (Same WiFi)
1. Find your computer's IP address:
   - Mac: System Preferences → Network
   - Or run in Terminal: `ifconfig | grep "inet "`
2. Update the URL:
```swift
static let baseURL = "http://192.168.1.XXX:3000"  // Replace XXX with your IP
```

### For Production
```swift
static let baseURL = "https://your-api.herokuapp.com"
```

---

## 🌐 Common Language Codes

```swift
let commonLanguages = [
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "ru": "Russian",
    "ja": "Japanese",
    "ko": "Korean",
    "zh": "Chinese",
    "ar": "Arabic",
    "hi": "Hindi"
]
```

---

## 🐛 Troubleshooting

### "Cannot connect to localhost"
- Make sure the backend server is running (`npm run dev`)
- Check the port number matches (default: 3000)

### "Connection refused" on real device
- Use your computer's IP address, not `localhost`
- Make sure both devices are on the same WiFi network
- Check firewall settings

### "The resource could not be loaded"
- Backend might not be running
- Check the URL is correct
- Try the health check endpoint first

### Test Backend Connection
```swift
TranslationAPI.checkHealth { isHealthy in
    if isHealthy {
        print("✅ Backend is running!")
    } else {
        print("❌ Cannot connect to backend")
    }
}
```

---

## 📝 Best Practices

1. **Always update UI on main thread**
   ```swift
   DispatchQueue.main.async {
       // Update UI here
   }
   ```

2. **Handle errors gracefully**
   - Show user-friendly error messages
   - Provide retry options

3. **Add loading indicators**
   - Translations can take 1-3 seconds
   - Show progress to users

4. **Cache translations** (optional)
   - Store recent translations locally
   - Reduce API calls

5. **Validate input**
   - Check word is not empty
   - Trim whitespace

---

## 🚀 Next Steps

1. Copy `TranslationAPI.swift` to your Swift project
2. Update `baseURL` to match your setup
3. Test with the health check endpoint
4. Try translating a simple word
5. Build your UI around the API

---

## 💡 Tips

- Start with simple translations before building complex UI
- Test on simulator first, then real device
- Use the `/health` endpoint to verify connection
- Check backend console logs for debugging
- Language codes are case-insensitive but lowercase is recommended

---

## 📞 Need Help?

If you encounter issues:
1. Check backend is running: `http://localhost:3000/health`
2. Verify the URL in Swift matches the backend
3. Check backend console for error messages
4. Test API with Postman/curl first to isolate issues
