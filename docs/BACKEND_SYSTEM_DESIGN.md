# 🏗️ Backend System Design - Complete Overview

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [API Endpoints](#api-endpoints)
4. [Data Flow Diagrams](#data-flow-diagrams)
5. [External Services](#external-services)
6. [Component Architecture](#component-architecture)
7. [Request/Response Patterns](#requestresponse-patterns)
8. [Error Handling](#error-handling)
9. [Performance Considerations](#performance-considerations)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        iOS Client (Swift)                    │
│                    - Translation App                        │
│                    - Photo Capture                          │
│                    - UI Display                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS/REST API
                        │
┌───────────────────────▼─────────────────────────────────────┐
│              Express.js Backend Server                       │
│              (Node.js Runtime)                               │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │              Middleware Layer                      │     │
│  │  - CORS                                            │     │
│  │  - JSON Parser                                     │     │
│  │  - Request Logging                                 │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │              API Endpoints                        │     │
│  │  - /health                                        │     │
│  │  - /api/translate                                 │     │
│  │  - /api/translate-with-example                   │     │
│  │  - /api/pronunciation                             │     │
│  │  - /api/languages                                 │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │           Helper Functions                        │     │
│  │  - generateContextualSentence()                   │     │
│  │  - Quality sorting algorithms                     │     │
│  └────────────────────────────────────────────────────┘     │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Dictionary  │ │  Translation │ │  Google TTS  │
│     API      │ │     API      │ │   Service    │
│              │ │              │ │              │
│dictionaryapi │ │  MyMemory    │ │  translate.  │
│    .dev      │ │  translated  │ │  google.com  │
│              │ │    .net      │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

---

## Technology Stack

### Core Framework
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 4.18.2
- **Language**: JavaScript (ES6+)

### Dependencies
```json
{
  "express": "^4.18.2",      // Web framework
  "cors": "^2.8.5",           // Cross-origin resource sharing
  "axios": "^1.6.0",         // HTTP client for external APIs
  "dotenv": "^16.3.1"        // Environment variables
}
```

### Infrastructure
- **Deployment**: Render.com (or any Node.js hosting)
- **Port**: 3000 (configurable via PORT env var)
- **Protocol**: HTTP/HTTPS
- **Data Format**: JSON

---

## API Endpoints

### 1. Health Check
```
GET /health
```
**Purpose**: Monitor server status and uptime

**Request**: None

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-25T18:00:00.000Z",
  "uptime": 12345.67
}
```

**Flow**:
```
Client → Express → Return server stats
(No external calls)
```

---

### 2. Root Endpoint
```
GET /
```
**Purpose**: API information and available endpoints

**Response**:
```json
{
  "message": "ECE496 Translation API",
  "version": "2.0.0",
  "endpoints": {
    "health": "GET /health",
    "translate": "POST /api/translate",
    "translateWithExample": "POST /api/translate-with-example",
    "pronunciation": "POST /api/pronunciation",
    "languages": "GET /api/languages"
  }
}
```

---

### 3. Simple Translation
```
POST /api/translate
```
**Purpose**: Translate a single word to target language

**Request**:
```json
{
  "word": "hello",
  "targetLanguage": "es"
}
```

**Flow Diagram**:
```
┌─────────┐
│ Client  │
└────┬────┘
     │ POST /api/translate
     │ { word, targetLanguage }
     ▼
┌─────────────────┐
│ Express Server  │
│                 │
│ [1] Validate    │
│ [2] Call API    │
└────┬────────────┘
     │
     │ GET https://api.mymemory.translated.net/get
     │ ?q=hello&langpair=en|es
     ▼
┌─────────────────┐
│ MyMemory API    │
└────┬────────────┘
     │
     │ { translatedText: "hola", match: 0.99 }
     ▼
┌─────────────────┐
│ Express Server  │
│                 │
│ [3] Format      │
│ [4] Return      │
└────┬────────────┘
     │
     │ JSON Response
     ▼
┌─────────┐
│ Client  │
└─────────┘
```

**Response**:
```json
{
  "success": true,
  "original": "hello",
  "translated": "hola",
  "targetLanguage": "es",
  "confidence": 0.99,
  "alternatives": [
    {
      "translation": "hola",
      "quality": "100",
      "source": "MyMemory"
    }
  ],
  "timestamp": "2026-01-25T18:00:00.000Z"
}
```

**External Service**: MyMemory Translation API
- **Endpoint**: `https://api.mymemory.translated.net/get`
- **Method**: GET
- **Parameters**: `q` (text), `langpair` (language pair)
- **Timeout**: 10 seconds

---

### 4. Translation with Examples (Complex Flow)
```
POST /api/translate-with-example
```
**Purpose**: Translate word + get 3-5 example sentences

**Request**:
```json
{
  "word": "hello",
  "targetLanguage": "es"
}
```

**Complete Flow Diagram**:
```
┌─────────┐
│ Client  │
└────┬────┘
     │ POST /api/translate-with-example
     ▼
┌─────────────────────────────────────┐
│      Express Server                  │
│                                      │
│  STEP 1: Extract & Validate         │
│  └─→ englishWord = "hello"           │
│                                      │
│  STEP 2: Dictionary Lookup          │
│  └─→ GET dictionaryapi.dev          │
│      └─→ Extract examples            │
│      └─→ Extract word type           │
│      └─→ Quality sort (top 5)        │
│                                      │
│  STEP 3: Translate Word             │
│  └─→ GET MyMemory API               │
│      └─→ "hello" → "hola"            │
│                                      │
│  STEP 4: Translate Examples         │
│  └─→ Promise.all([                  │
│        GET MyMemory (example 1),     │
│        GET MyMemory (example 2),     │
│        GET MyMemory (example 3),     │
│        GET MyMemory (example 4),     │
│        GET MyMemory (example 5)      │
│      ])                              │
│                                      │
│  STEP 5: Assemble Response          │
└────┬─────────────────────────────────┘
     │
     │ JSON Response
     ▼
┌─────────┐
│ Client  │
└─────────┘
```

**Detailed Step Breakdown**:

#### STEP 2: Dictionary API Processing
```
Dictionary API Response Structure:
{
  "data": [
    {
      "meanings": [
        {
          "partOfSpeech": "interjection",
          "definitions": [
            {
              "definition": "...",
              "example": "Hello, everyone."
            },
            {
              "definition": "...",
              "example": "Hello? Is anyone there?"
            }
          ]
        }
      ]
    }
  ]
}

Processing:
1. Loop through entries
2. Extract partOfSpeech (word type)
3. Collect all example sentences
4. Apply quality sorting algorithm
5. Select top 5 examples
```

#### Quality Sorting Algorithm:
```javascript
Priority Order:
1. Exact word match (word boundaries)
   → "Hello, everyone." ✓
   → "He said hello." ✓
   
2. Contains word (anywhere)
   → "Say hello to your friend." ✓
   
3. Length (15-150 chars preferred)
   → "Hello!" (too short)
   → "Hello, everyone." (good)
   → Very long sentence (penalty)
```

#### STEP 4: Parallel Translation
```
Sequential (OLD):
Example 1 → wait 800ms
Example 2 → wait 800ms
Example 3 → wait 800ms
Total: 2400ms

Parallel (NEW):
Example 1 ┐
Example 2 ├─→ Promise.all() → wait 800ms
Example 3 ┘
Total: 800ms (3x faster!)
```

**Response**:
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
    }
    // ... 3 more examples
  ],
  "exampleSentence": { /* backward compatibility */ },
  "confidence": 0.99,
  "timestamp": "2026-01-25T18:00:00.000Z"
}
```

**Fallback Flow** (if Dictionary API fails):
```
Dictionary API fails
    ↓
Detect word type from patterns:
  - "ing", "ed" → verb
  - "ful", "less" → adjective
  - "tion", "ment" → noun
    ↓
Generate 3 contextual templates:
  - Verb: "I {word} every day."
  - Adjective: "This is very {word}."
  - Noun: "I saw a {word} yesterday."
    ↓
Continue to STEP 3 (translation)
```

---

### 5. Pronunciation
```
POST /api/pronunciation
```
**Purpose**: Get audio URL for word pronunciation

**Request**:
```json
{
  "word": "hola",
  "language": "es"
}
```

**Flow Diagram**:
```
┌─────────┐
│ Client  │
└────┬────┘
     │ POST /api/pronunciation
     ▼
┌─────────────────┐
│ Express Server  │
│                 │
│ [1] Validate    │
│ [2] Map lang   │
│ [3] Encode URL │
│ [4] Generate   │
│     TTS URL     │
└────┬────────────┘
     │
     │ Return URL (no external call)
     ▼
┌─────────┐
│ Client  │
│         │
│ Uses    │
│ AVPlayer│
│ to play │
│ URL     │
└────┬────┘
     │
     │ GET https://translate.google.com/translate_tts?...
     ▼
┌─────────────────┐
│  Google TTS     │
│  (Client-side)  │
│                 │
│ Returns MP3     │
│ audio stream    │
└─────────────────┘
```

**URL Generation**:
```javascript
const audioUrl = `https://translate.google.com/translate_tts?
  ie=UTF-8&                    // Input encoding
  tl=${ttsLanguage}&           // Target language (es, fr, etc.)
  client=tw-ob&                // Client identifier
  q=${encodedWord}`            // Word to pronounce
```

**Response**:
```json
{
  "success": true,
  "word": "hola",
  "language": "es",
  "audioUrl": "https://translate.google.com/translate_tts?...",
  "format": "mp3",
  "source": "Google Translate TTS",
  "timestamp": "2026-01-25T18:00:00.000Z"
}
```

**Note**: Server doesn't fetch audio, just generates URL. Client streams directly from Google.

---

### 6. Get Languages
```
GET /api/languages
```
**Purpose**: List all supported languages

**Request**: None

**Response**:
```json
{
  "success": true,
  "languages": [
    { "code": "es", "name": "Spanish" },
    { "code": "fr", "name": "French" },
    // ... 15 languages total
  ]
}
```

**Flow**: Static data, no external calls

---

## Component Architecture

### Middleware Stack
```
Request
  ↓
┌─────────────────────┐
│ CORS Middleware     │ ← Allows cross-origin requests
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ JSON Parser         │ ← Parses request body
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ URL Encoder         │ ← Handles URL-encoded data
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Request Logger      │ ← Logs all requests
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Route Handler       │ ← Processes request
└──────────┬──────────┘
           ↓
┌─────────────────────┐
│ Response Formatter  │ ← Formats JSON response
└──────────┬──────────┘
           ↓
Response
```

### Error Handling Flow
```
Request
  ↓
Route Handler
  ↓
┌─────────────────────┐
│ Try Block           │
│  - Validate input   │
│  - Call external API│
│  - Process data     │
└──────────┬──────────┘
           │
     ┌─────┴─────┐
     │           │
     ▼           ▼
┌─────────┐ ┌──────────────┐
│ Success │ │ Error        │
│         │ │              │
│ Return  │ │ Catch Block  │
│ JSON    │ │  - Log error │
│         │ │  - Return    │
│         │ │    error JSON│
└─────────┘ └──────────────┘
```

---

## External Services Integration

### 1. Dictionary API (dictionaryapi.dev)
```
Purpose: Get example sentences and word definitions
Endpoint: GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}
Timeout: 5 seconds
Free: Yes, no API key
Rate Limit: None specified

Request Flow:
Express → axios.get() → Dictionary API
         ↓
    Response Structure:
    {
      data: [{
        meanings: [{
          partOfSpeech: "noun",
          definitions: [{
            definition: "...",
            example: "Hello, everyone."
          }]
        }]
      }]
    }
```

### 2. MyMemory Translation API
```
Purpose: Translate text between languages
Endpoint: GET https://api.mymemory.translated.net/get
Parameters:
  - q: Text to translate
  - langpair: Language pair (en|es)
Timeout: 10 seconds
Free: Yes, 10,000 words/day
Rate Limit: 10,000 words/day

Request Flow:
Express → axios.get() → MyMemory API
         ↓
    Response:
    {
      responseData: {
        translatedText: "hola",
        match: 0.99
      },
      matches: [...]
    }
```

### 3. Google Translate TTS
```
Purpose: Generate pronunciation audio
Endpoint: GET https://translate.google.com/translate_tts?...
Parameters:
  - tl: Target language
  - q: Word to pronounce
  - client: tw-ob
Free: Yes, public endpoint
Format: MP3 audio stream

Note: Server generates URL, client fetches audio directly
```

---

## Request/Response Patterns

### Standard Request Pattern
```javascript
POST /api/{endpoint}
Content-Type: application/json

{
  "field1": "value1",
  "field2": "value2"
}
```

### Standard Success Response
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2026-01-25T18:00:00.000Z"
}
```

### Standard Error Response
```json
{
  "error": "Error Type",
  "message": "Human-readable message",
  "timestamp": "2026-01-25T18:00:00.000Z"
}
```

### Error Codes
- `400`: Bad Request (missing/invalid parameters)
- `404`: Not Found (invalid endpoint)
- `500`: Internal Server Error
- `504`: Gateway Timeout (external API timeout)

---

## Performance Considerations

### 1. Parallel Processing
```javascript
// Sequential (slow)
for (const example of examples) {
  await translate(example);  // 800ms each
}
// Total: 800ms × 5 = 4000ms

// Parallel (fast)
await Promise.all(
  examples.map(example => translate(example))
);
// Total: ~800ms (all at once)
```

### 2. Timeout Management
```javascript
// Dictionary API: 5 seconds
axios.get(url, { timeout: 5000 })

// Translation API: 10 seconds
axios.get(url, { timeout: 10000 })
```

### 3. Error Resilience
- Dictionary fails → Use generated templates
- Translation fails → Return original text
- Always returns something (never crashes)

### 4. Stateless Design
- No database
- No session storage
- No caching (can be added)
- Horizontally scalable

---

## System Characteristics

### Scalability
- ✅ Stateless (can run multiple instances)
- ✅ No database (no connection pooling needed)
- ✅ External API calls (scales with external services)
- ⚠️ Rate limits on external APIs (10k words/day MyMemory)

### Reliability
- ✅ Error handling on all endpoints
- ✅ Timeout protection
- ✅ Fallback mechanisms
- ✅ Graceful degradation

### Security
- ✅ Input validation
- ✅ URL encoding
- ✅ CORS enabled (controlled access)
- ✅ No user data storage
- ✅ No authentication needed (public API)

### Maintainability
- ✅ Clear code structure
- ✅ Modular functions
- ✅ Comprehensive logging
- ✅ Error messages

---

## Deployment Architecture

```
┌─────────────────────────────────────┐
│         Render.com (Cloud)          │
│                                     │
│  ┌───────────────────────────────┐ │
│  │    Node.js Runtime            │ │
│  │                               │ │
│  │  ┌─────────────────────────┐ │ │
│  │  │  Express Server          │ │ │
│  │  │  Port: 3000              │ │ │
│  │  │  Process: server.js      │ │ │
│  │  └─────────────────────────┘ │ │
│  │                               │ │
│  │  Environment Variables:       │ │
│  │  - PORT (auto-set by Render)  │ │
│  │  - NODE_ENV (production)      │ │
│  └───────────────────────────────┘ │
│                                     │
│  Auto-scaling:                     │
│  - Sleeps after 15min inactivity   │
│  - Wakes on first request          │
└─────────────────────────────────────┘
```

---

## Data Flow Summary

### Simple Translation Flow
```
Client → Express → MyMemory API → Express → Client
(1 external call, ~800ms)
```

### Translation with Examples Flow
```
Client → Express → Dictionary API → Express
                    ↓
                 MyMemory API (word)
                    ↓
                 MyMemory API (examples × 5, parallel)
                    ↓
                 Express → Client
(1 + 1 + 5 = 7 external calls, ~2-3 seconds total)
```

### Pronunciation Flow
```
Client → Express → Client (URL only)
                    ↓
                 Google TTS (direct from client)
(0 external calls from server, instant response)
```

---

## Key Design Decisions

1. **No Database**: Stateless design, faster, simpler
2. **Parallel Processing**: 3-5x faster example translation
3. **Fallback Mechanisms**: Always returns something
4. **Free Services**: No API costs
5. **URL-based Audio**: No server storage needed
6. **Backward Compatibility**: Old code still works

---

This system is designed to be:
- ✅ **Fast**: Parallel processing, timeouts
- ✅ **Reliable**: Error handling, fallbacks
- ✅ **Scalable**: Stateless, no database
- ✅ **Free**: Uses free APIs
- ✅ **Simple**: Easy to understand and maintain
