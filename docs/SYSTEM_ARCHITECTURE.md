# 🏗️ System Architecture - Pronunciation & Example Sentences

## Overview

This document explains how the **Pronunciation** and **Improved Example Sentences** features work, including data flow, algorithms, and external service integrations.

---

## 🔊 Pronunciation Feature

### Architecture Flow

```
iOS App (Swift)
    ↓
    POST /api/pronunciation
    { word: "hola", language: "es" }
    ↓
Express.js Server (Node.js)
    ↓
    [1] Validate input (word, language)
    ↓
    [2] Map language code to Google TTS format
    ↓
    [3] Encode word for URL
    ↓
    [4] Generate Google Translate TTS URL
    ↓
    [5] Return audio URL to client
    ↓
iOS App receives audioUrl
    ↓
    Uses AVPlayer to play audio
```

### Implementation Details

#### Step 1: Request Validation
```javascript
POST /api/pronunciation
{
  "word": "hola",
  "language": "es"
}
```
- Validates both `word` and `language` are provided
- Returns 400 error if missing

#### Step 2: Language Code Mapping
```javascript
const languageMap = {
  'es': 'es',      // Spanish
  'fr': 'fr',      // French
  'ja': 'ja',      // Japanese
  'zh-CN': 'zh-CN' // Chinese (Simplified)
  // ... 15+ languages
};
```
- Maps our internal language codes to Google TTS format
- Handles special cases (e.g., Chinese Simplified vs Traditional)

#### Step 3: URL Generation
```javascript
const encodedWord = encodeURIComponent(word);
const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLanguage}&client=tw-ob&q=${encodedWord}`;
```

**URL Components:**
- `ie=UTF-8` - Input encoding
- `tl=${ttsLanguage}` - Target language code
- `client=tw-ob` - Client identifier (Google Translate web client)
- `q=${encodedWord}` - Query word (URL encoded)

#### Step 4: Response
```json
{
  "success": true,
  "word": "hola",
  "language": "es",
  "audioUrl": "https://translate.google.com/translate_tts?...",
  "format": "mp3",
  "source": "Google Translate TTS"
}
```

### Key Design Decisions

1. **No Audio Storage**: We return a URL, not audio data
   - Reduces server storage/bandwidth
   - Client streams directly from Google
   - Faster response time

2. **Free Service**: Google Translate TTS is free and doesn't require API keys
   - No authentication needed
   - No rate limiting issues (for reasonable use)
   - High quality native speaker audio

3. **Stateless**: Each request is independent
   - No caching needed
   - No session management
   - Scales horizontally

---

## 📝 Improved Example Sentences Feature

### Architecture Flow

```
iOS App (Swift)
    ↓
    POST /api/translate-with-example
    { word: "hello", targetLanguage: "es" }
    ↓
Express.js Server (Node.js)
    ↓
    [STEP 1] Extract English word
    ↓
    [STEP 2] Fetch from Dictionary API
    ├─→ Success: Get examples + word type
    └─→ Fail: Generate contextual templates
    ↓
    [STEP 3] Translate word to target language
    ↓
    [STEP 4] Translate all examples (parallel)
    ↓
    [STEP 5] Return 3-5 examples
    ↓
iOS App receives exampleSentences array
```

### Detailed Step-by-Step Process

#### STEP 1: Input Processing
```javascript
const { word, targetLanguage } = req.body;
let englishWord = word; // Assume English input
```
- Extracts word and target language
- Currently assumes English input (can be enhanced for auto-detection)

#### STEP 2: Dictionary API Lookup

**2a. API Call:**
```javascript
const dictionaryResponse = await axios.get(
  `https://api.dictionaryapi.dev/api/v2/entries/en/${englishWord.toLowerCase()}`,
  { timeout: 5000 }
);
```

**2b. Data Extraction:**
```javascript
// Extract from nested structure:
dictionaryResponse.data[0]
  .meanings[0]
    .definitions[0]
      .example  // ← The example sentence
```

**2c. Word Type Detection:**
```javascript
meaning.partOfSpeech  // "noun", "verb", "adjective", etc.
```

**2d. Collect All Examples:**
```javascript
const allExamples = [];
// Loops through all entries → meanings → definitions
// Collects every example sentence found
```

#### STEP 3: Quality-Based Selection Algorithm

**Sorting Criteria (Priority Order):**

1. **Exact Word Match** (Highest Priority)
   ```javascript
   // Checks if word appears with word boundaries
   aLower.includes(` ${lowerWord} `) ||  // Word in middle
   aLower.startsWith(`${lowerWord} `) ||  // Word at start
   aLower.endsWith(` ${lowerWord}`)       // Word at end
   ```

2. **Contains Word** (Second Priority)
   ```javascript
   aLower.includes(lowerWord)  // Word appears anywhere
   ```

3. **Sentence Length** (Third Priority)
   ```javascript
   // Prefer 15-150 characters
   if (aLength < 15 && bLength >= 15) return 1;  // Too short
   return aLength - bLength;  // Shorter is better
   ```

**Selection:**
```javascript
allExamples.sort(/* sorting function */);
const maxExamples = Math.min(5, allExamples.length);
exampleSentences = allExamples.slice(0, maxExamples);
```

#### STEP 4: Fallback Generation

If dictionary API fails or returns no examples:

**4a. Word Type Detection (Pattern-Based):**
```javascript
// Verb endings
if (word.endsWith('ing') || word.endsWith('ed')) wordType = 'verb';

// Adjective endings  
if (word.endsWith('ful') || word.endsWith('less')) wordType = 'adjective';

// Noun endings
if (word.endsWith('tion') || word.endsWith('ment')) wordType = 'noun';
```

**4b. Template Selection by Word Type:**

**Verbs:**
```javascript
templates = [
  "I ${word} every day.",
  "Can you ${word}?",
  "Let's ${word} together."
];
```

**Adjectives:**
```javascript
templates = [
  "This is very ${word}.",
  "That's so ${word}!",
  "I feel ${word} today."
];
```

**Nouns:**
```javascript
templates = [
  "I saw a ${word} yesterday.",
  "Can you show me the ${word}?",
  "This is a ${word}."
];
```

**4c. Variation Generation:**
```javascript
// Generate 3 different examples
for (let i = 0; i < 3; i++) {
  const index = (word.length + i) % templates.length;
  const sentence = templates[index];
  // Uses hash of word + index to get different templates
}
```

#### STEP 5: Translation (Parallel Processing)

**Translate Word:**
```javascript
const wordTranslationResponse = await axios.get(
  'https://api.mymemory.translated.net/get',
  { params: { q: englishWord, langpair: `en|${targetLanguage}` } }
);
```

**Translate All Examples (Parallel):**
```javascript
const translatedExamples = await Promise.all(
  exampleSentences.map(async (example) => {
    const response = await axios.get(
      'https://api.mymemory.translated.net/get',
      { params: { q: example.original, langpair: `en|${targetLanguage}` } }
    );
    return {
      original: example.original,
      translated: response.data.responseData.translatedText,
      source: example.source
    };
  })
);
```

**Why Parallel?**
- 3-5 examples = 3-5 API calls
- Sequential: 3-5 seconds total
- Parallel: ~1 second total (all at once)

#### STEP 6: Response Assembly
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
    // ... 2-4 more examples
  ],
  "exampleSentence": { /* backward compatibility */ }
}
```

---

## 🔄 Data Flow Diagram

```
┌─────────────┐
│   iOS App   │
│   (Swift)   │
└──────┬──────┘
       │
       │ POST /api/translate-with-example
       │ { word: "hello", targetLanguage: "es" }
       │
       ▼
┌─────────────────────────────────────┐
│     Express.js Server (Node.js)     │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  STEP 1: Extract word        │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│             ▼                       │
│  ┌──────────────────────────────┐  │
│  │  STEP 2: Dictionary API      │  │
│  │  GET dictionaryapi.dev       │  │
│  │  ├─→ Extract examples        │  │
│  │  ├─→ Extract word type      │  │
│  │  └─→ Quality sort (3-5)     │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│             │ (if no examples)          │
│             ▼                       │
│  ┌──────────────────────────────┐  │
│  │  Fallback: Generate          │  │
│  │  ├─→ Detect word type        │  │
│  │  └─→ Use templates (3)       │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│             ▼                       │
│  ┌──────────────────────────────┐  │
│  │  STEP 3: Translate word      │  │
│  │  GET mymemory.translated.net  │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│             ▼                       │
│  ┌──────────────────────────────┐  │
│  │  STEP 4: Translate examples   │  │
│  │  (Parallel - Promise.all)     │  │
│  │  GET mymemory.translated.net  │  │
│  │  (3-5 parallel requests)      │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│             ▼                       │
│  ┌──────────────────────────────┐  │
│  │  STEP 5: Return response     │  │
│  │  { exampleSentences: [...] } │  │
│  └──────────┬───────────────────┘  │
└─────────────┼───────────────────────┘
              │
              │ JSON Response
              ▼
┌─────────────┐
│   iOS App   │
│ Displays    │
│ 3-5 examples│
└─────────────┘
```

---

## 🌐 External Services Used

### 1. Dictionary API (dictionaryapi.dev)
- **Purpose**: Get real example sentences
- **Endpoint**: `GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- **Returns**: Definitions, examples, word type (part of speech)
- **Free**: Yes, no API key required
- **Rate Limit**: None specified (reasonable use)

### 2. MyMemory Translation API
- **Purpose**: Translate words and sentences
- **Endpoint**: `GET https://api.mymemory.translated.net/get`
- **Parameters**: `q={text}&langpair=en|{target}`
- **Free**: Yes, no API key required
- **Rate Limit**: 10,000 words/day (free tier)

### 3. Google Translate TTS
- **Purpose**: Generate pronunciation audio
- **Endpoint**: `GET https://translate.google.com/translate_tts?...`
- **Parameters**: `tl={language}&q={word}`
- **Free**: Yes, public endpoint
- **Format**: MP3 audio stream
- **Note**: Uses public web interface (no official API)

---

## 🧮 Algorithm: Example Selection

### Quality Scoring Function

```javascript
function scoreExample(example, word) {
  let score = 0;
  
  // Exact match: +100 points
  if (hasExactMatch(example, word)) score += 100;
  
  // Contains word: +50 points
  else if (containsWord(example, word)) score += 50;
  
  // Length penalty: -1 per character over 100
  const length = example.length;
  if (length > 100) score -= (length - 100);
  
  // Too short penalty: -20 if < 15 chars
  if (length < 15) score -= 20;
  
  return score;
}
```

### Sorting Implementation

```javascript
allExamples.sort((a, b) => {
  // Priority 1: Exact match
  if (aHasExact && !bHasExact) return -1;
  if (!aHasExact && bHasExact) return 1;
  
  // Priority 2: Contains word
  if (aHasWord && !bHasWord) return -1;
  if (!aHasWord && bHasWord) return 1;
  
  // Priority 3: Length (shorter = better, but not too short)
  if (aLength < 15 && bLength >= 15) return 1;  // Too short is bad
  if (bLength < 15 && aLength >= 15) return -1;
  
  return aLength - bLength;  // Prefer shorter
});
```

---

## ⚡ Performance Optimizations

### 1. Parallel Translation
- **Before**: Sequential (3-5 seconds for 5 examples)
- **After**: Parallel with `Promise.all` (~1 second)
- **Improvement**: 3-5x faster

### 2. Timeout Handling
```javascript
{ timeout: 5000 }  // Dictionary API
{ timeout: 10000 } // Translation API
```
- Prevents hanging requests
- Falls back to generated examples if dictionary fails

### 3. Error Resilience
```javascript
try {
  // Dictionary API call
} catch (error) {
  // Fallback to generated examples
  // App still works even if external API fails
}
```

### 4. Caching Opportunities (Future)
- Cache dictionary responses (words don't change)
- Cache translations (same word + language = same result)
- Could reduce API calls by 80%+

---

## 🔐 Security Considerations

### 1. Input Validation
```javascript
if (!word || !targetLanguage) {
  return res.status(400).json({ error: 'Missing required fields' });
}
```

### 2. URL Encoding
```javascript
const encodedWord = encodeURIComponent(word);
```
- Prevents URL injection
- Handles special characters safely

### 3. No User Data Storage
- Stateless design
- No personal information stored
- No authentication needed

---

## 📊 Example: Complete Request Flow

### Input
```json
POST /api/translate-with-example
{
  "word": "hello",
  "targetLanguage": "es"
}
```

### Internal Processing
1. **Dictionary API Call** (500ms)
   - Fetches: 8 example sentences
   - Extracts: word type = "interjection"

2. **Quality Sort** (1ms)
   - Sorts by: exact match → contains word → length
   - Selects: Top 5 examples

3. **Word Translation** (800ms)
   - "hello" → "hola"

4. **Example Translation** (1000ms - parallel)
   - 5 examples translated simultaneously
   - All complete in ~1 second (not 5 seconds)

5. **Response Assembly** (1ms)
   - Combines all data
   - Adds backward compatibility field

### Output
```json
{
  "success": true,
  "original": "hello",
  "translated": "hola",
  "exampleSentences": [
    { "original": "Hello, everyone.", "translated": "Hola a todos.", "source": "dictionary" },
    { "original": "Hello? Is anyone there?", "translated": "Hola, ¿hay alguien ahí?", "source": "dictionary" },
    // ... 3 more examples
  ]
}
```

**Total Time**: ~2.3 seconds

---

## 🎯 Key Design Principles

1. **Fail Gracefully**: Always return something, even if external APIs fail
2. **Quality First**: Prioritize real dictionary examples over generated ones
3. **Performance**: Use parallel processing where possible
4. **Backward Compatible**: Old code still works with new features
5. **Stateless**: No server-side state, scales horizontally
6. **Free Services**: Use free APIs to avoid costs

---

## 🔮 Future Improvements

1. **Caching Layer**: Redis/Memory cache for dictionary responses
2. **Language Detection**: Auto-detect input language (not just English)
3. **Batch Processing**: Translate multiple words at once
4. **Offline Support**: Cache common words for offline use
5. **Audio Caching**: Cache pronunciation URLs (they're stable)

---

This architecture is designed to be:
- ✅ **Fast**: Parallel processing, timeouts
- ✅ **Reliable**: Fallbacks, error handling
- ✅ **Scalable**: Stateless, no database
- ✅ **Free**: Uses free APIs
- ✅ **Simple**: Easy to understand and maintain
