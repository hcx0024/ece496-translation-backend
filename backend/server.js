const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for Swift frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'ECE496 Translation API',
    version: '2.0.0',
    endpoints: {
      health: 'GET /health',
      translate: 'POST /api/translate',
      translateWithExample: 'POST /api/translate-with-example',
      pronunciation: 'POST /api/pronunciation',
      languages: 'GET /api/languages'
    }
  });
});

// Translation endpoint
app.post('/api/translate', async (req, res) => {
  try {
    const { word, targetLanguage } = req.body;

    // Validation
    if (!word || !targetLanguage) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both "word" and "targetLanguage" are required',
        example: {
          word: 'hello',
          targetLanguage: 'es'
        }
      });
    }

    console.log(`Translating "${word}" to ${targetLanguage}`);

    // Call external translation API (MyMemory Translation API - Free, no API key required)
    const translationResponse = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: word,
        langpair: `en|${targetLanguage}`
      },
      timeout: 10000
    });

    if (translationResponse.data && translationResponse.data.responseData) {
      const translatedText = translationResponse.data.responseData.translatedText;
      const matches = translationResponse.data.matches || [];

      const frenchGrammar = targetLanguage === 'fr' ? await getFrenchGrammarInfo(translatedText) : null;

      // Return translation result
      res.json({
        success: true,
        original: word,
        translated: translatedText,
        targetLanguage: targetLanguage,
        confidence: translationResponse.data.responseData.match || 0,
        alternatives: matches.slice(0, 3).map(m => ({
          translation: m.translation,
          quality: m.quality,
          source: m.source
        })),
        frenchGrammar,
        timestamp: new Date().toISOString()
      });
    } else {
      throw new Error('Invalid response from translation service');
    }

  } catch (error) {
    console.error('Translation error:', error.message);

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: 'Translation service timeout',
        message: 'The translation service took too long to respond'
      });
    }

    res.status(500).json({
      error: 'Translation failed',
      message: error.message || 'An error occurred while translating',
      timestamp: new Date().toISOString()
    });
  }
});

// Translate word with example sentence
app.post('/api/translate-with-example', async (req, res) => {
  try {
    const { word, targetLanguage } = req.body;

    // Validation
    if (!word || !targetLanguage) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both "word" and "targetLanguage" are required',
        example: {
          word: 'hello',
          targetLanguage: 'es'
        }
      });
    }

    console.log(`Translating "${word}" with example to ${targetLanguage}`);

    // Step 1: Assume input is English, or try to translate to English
    // For simplicity, we'll assume English input first, then try translation if needed
    let englishWord = word;

    // Try to detect if word is not English by attempting translation
    // We'll use the word as-is for dictionary lookup first
    console.log(`Step 1: Using "${englishWord}" for dictionary lookup`);

    // Step 2: Get multiple English example sentences from Free Dictionary API
    let exampleSentences = [];
    let wordType = null; // noun, verb, adjective, etc.

    try {
      const dictionaryResponse = await axios.get(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${englishWord.toLowerCase()}`,
        { timeout: 5000 }
      );

      // Extract multiple example sentences and word type
      if (dictionaryResponse.data && Array.isArray(dictionaryResponse.data)) {
        const allExamples = [];
        
        for (const entry of dictionaryResponse.data) {
          // Extract word type (part of speech)
          if (entry.meanings && Array.isArray(entry.meanings)) {
            for (const meaning of entry.meanings) {
              // Get part of speech (noun, verb, adjective, etc.)
              if (meaning.partOfSpeech && !wordType) {
                wordType = meaning.partOfSpeech;
              }
              
              // Collect all example sentences
              if (meaning.definitions && Array.isArray(meaning.definitions)) {
                for (const definition of meaning.definitions) {
                  if (definition.example) {
                    allExamples.push({
                      example: definition.example,
                      definition: definition.definition || ''
                    });
                  }
                }
              }
            }
          }
        }
        
        // Select the best 3-5 examples: prefer shorter, clearer sentences
        if (allExamples.length > 0) {
          // Sort by length (prefer shorter sentences) and quality
          allExamples.sort((a, b) => {
            const aLength = a.example.length;
            const bLength = b.example.length;
            const lowerWord = englishWord.toLowerCase();
            const aLower = a.example.toLowerCase();
            const bLower = b.example.toLowerCase();
            
            // Check for exact word match (with word boundaries for better matching)
            const aHasExact = aLower.includes(` ${lowerWord} `) || 
                             aLower.startsWith(`${lowerWord} `) || 
                             aLower.endsWith(` ${lowerWord}`) ||
                             aLower === lowerWord;
            const bHasExact = bLower.includes(` ${lowerWord} `) || 
                             bLower.startsWith(`${lowerWord} `) || 
                             bLower.endsWith(` ${lowerWord}`) ||
                             bLower === lowerWord;
            
            const aHasWord = aLower.includes(lowerWord);
            const bHasWord = bLower.includes(lowerWord);
            
            // Prioritize exact word matches first
            if (aHasExact && !bHasExact) return -1;
            if (!aHasExact && bHasExact) return 1;
            
            // Then prioritize sentences that contain the word
            if (aHasWord && !bHasWord) return -1;
            if (!aHasWord && bHasWord) return 1;
            
            // Then prefer shorter sentences (but not too short - at least 15 chars)
            if (aLength < 15 && bLength >= 15) return 1;
            if (bLength < 15 && aLength >= 15) return -1;
            
            return aLength - bLength;
          });
          
          // Take top 5 examples (or all if less than 5)
          const maxExamples = Math.min(5, allExamples.length);
          exampleSentences = allExamples.slice(0, maxExamples).map(e => ({
            original: e.example,
            source: 'dictionary'
          }));
        }
      }
    } catch (dictError) {
      console.log('Dictionary API failed, will use template sentences');
    }

    // Fallback: Create contextual sentences if no examples found
    if (exampleSentences.length === 0) {
      // Generate 3 different contextual sentences
      const generatedExamples = [];
      for (let i = 0; i < 3; i++) {
        // Use different templates by varying the word slightly for hash
        const tempWord = englishWord + (i > 0 ? String(i) : '');
        const sentence = generateContextualSentence(englishWord, wordType, i);
        generatedExamples.push({
          original: sentence,
          source: 'generated'
        });
      }
      exampleSentences = generatedExamples;
    }

    console.log(`Step 2: Found ${exampleSentences.length} example sentences`);

    // Step 3: Translate the word to target language (from English)
    const wordTranslationResponse = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: englishWord,
        langpair: `en|${targetLanguage}`
      },
      timeout: 10000
    });

    const translatedWord = wordTranslationResponse.data?.responseData?.translatedText || englishWord;
    console.log(`Step 3: "${englishWord}" → "${translatedWord}" (${targetLanguage})`);

    // Step 4: Translate all example sentences to target language
    console.log(`Step 4: Translating ${exampleSentences.length} example sentences to ${targetLanguage}`);
    const translatedExamples = await Promise.all(
      exampleSentences.map(async (example) => {
        try {
          const sentenceTranslationResponse = await axios.get('https://api.mymemory.translated.net/get', {
            params: {
              q: example.original,
              langpair: `en|${targetLanguage}`
            },
            timeout: 10000
          });
          
          return {
            original: example.original,
            translated: sentenceTranslationResponse.data?.responseData?.translatedText || example.original,
            source: example.source
          };
        } catch (error) {
          console.log(`Failed to translate example: "${example.original}"`);
          return {
            original: example.original,
            translated: example.original, // Fallback to original if translation fails
            source: example.source
          };
        }
      })
    );

    console.log(`Step 4: Translated ${translatedExamples.length} example sentences`);

    const frenchGrammar = targetLanguage === 'fr' ? await getFrenchGrammarInfo(translatedWord) : null;

    // Return complete response with multiple examples
    res.json({
      success: true,
      original: word,
      translated: translatedWord,
      targetLanguage: targetLanguage,
      exampleSentences: translatedExamples,
      // Keep backward compatibility - include first example as exampleSentence
      exampleSentence: translatedExamples.length > 0 ? {
        original: translatedExamples[0].original,
        translated: translatedExamples[0].translated,
        source: translatedExamples[0].source
      } : null,
      confidence: wordTranslationResponse.data?.responseData?.match || 0,
      frenchGrammar,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Translation with example error:', error.message);

    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: 'Translation service timeout',
        message: 'The translation service took too long to respond'
      });
    }

    res.status(500).json({
      error: 'Translation failed',
      message: error.message || 'An error occurred while translating',
      timestamp: new Date().toISOString()
    });
  }
});

// Pronunciation endpoint - Returns audio URL for text-to-speech
app.post('/api/pronunciation', async (req, res) => {
  try {
    const { word, language } = req.body;

    // Validation
    if (!word || !language) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Both "word" and "language" are required',
        example: {
          word: 'hello',
          language: 'es'
        }
      });
    }

    console.log(`Getting pronunciation for "${word}" in ${language}`);

    // Map language codes to Google TTS language codes
    const languageMap = {
      'es': 'es',      // Spanish
      'fr': 'fr',      // French
      'de': 'de',      // German
      'it': 'it',      // Italian
      'pt': 'pt',      // Portuguese
      'ru': 'ru',      // Russian
      'ja': 'ja',      // Japanese
      'ko': 'ko',      // Korean
      'zh-CN': 'zh-CN', // Chinese (Simplified)
      'zh-TW': 'zh-TW', // Chinese (Traditional)
      'ar': 'ar',      // Arabic
      'hi': 'hi',      // Hindi
      'nl': 'nl',      // Dutch
      'pl': 'pl',      // Polish
      'tr': 'tr',      // Turkish
      'en': 'en'       // English
    };

    const ttsLanguage = languageMap[language] || language;

    // Encode the word for URL
    const encodedWord = encodeURIComponent(word);

    // Google Translate TTS endpoint (free, no API key required)
    // This generates a direct audio URL that can be used in iOS AVPlayer
    const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${ttsLanguage}&client=tw-ob&q=${encodedWord}`;

    // Return the audio URL
    res.json({
      success: true,
      word: word,
      language: language,
      audioUrl: audioUrl,
      format: 'mp3',
      source: 'Google Translate TTS',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Pronunciation error:', error.message);

    res.status(500).json({
      error: 'Pronunciation failed',
      message: error.message || 'An error occurred while getting pronunciation',
      timestamp: new Date().toISOString()
    });
  }
});

// Get supported languages
app.get('/api/languages', (req, res) => {
  res.json({
    success: true,
    languages: [
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh-CN', name: 'Chinese (Simplified)' },
      { code: 'zh-TW', name: 'Chinese (Traditional)' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' },
      { code: 'nl', name: 'Dutch' },
      { code: 'pl', name: 'Polish' },
      { code: 'tr', name: 'Turkish' }
    ]
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    availableEndpoints: {
      health: 'GET /health',
      translate: 'POST /api/translate',
      translateWithExample: 'POST /api/translate-with-example',
      pronunciation: 'POST /api/pronunciation',
      languages: 'GET /api/languages'
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'An error occurred' : err.message
  });
});

// ============================================
// 🔧 HELPER FUNCTIONS
// ============================================

/**
 * Strip leading French articles from a segment (for picking a dictionary lemma).
 */
function stripFrenchLeadingArticles(phrase) {
  let s = String(phrase || '')
    .trim()
    .toLowerCase()
    .replace(/^(l'|l’|la |le |les )/i, '');
  return s.trim();
}

/**
 * When MT returns merged variants (e.g. "climatisation/climatiseur/le climatiseur"),
 * pick one headword for gender/plural so the API never returns a "multi-plural" string.
 */
function pickFrenchLemmaForGrammar(raw) {
  const text = String(raw || '').trim();
  if (!text) return '';

  const segments = text
    .split(/[/;|]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  if (segments.length <= 1) {
    const single = stripFrenchLeadingArticles(text);
    const words = single.split(/\s+/).filter(Boolean);
    return words.length ? words[words.length - 1] : single;
  }

  const lemmas = segments.map((seg) => {
    const stripped = stripFrenchLeadingArticles(seg);
    const words = stripped.split(/\s+/).filter(Boolean);
    if (words.length === 0) return '';
    return words[words.length - 1];
  }).filter(Boolean);

  const unique = [...new Set(lemmas.map((l) => l.toLowerCase()))];
  if (unique.length === 1) return unique[0];

  const eurCandidate = unique.find((t) => t.endsWith('eur') || t.endsWith('euse'));
  if (eurCandidate) return eurCandidate;

  const teurCandidate = unique.find((t) => t.endsWith('teur'));
  if (teurCandidate) return teurCandidate;

  // Prefer last distinct segment (often the most specific gloss in MT output)
  return unique[unique.length - 1] || lemmas[lemmas.length - 1];
}

/**
 * FR-only grammar enrichment.
 * Wiktionary-first approach with heuristic fallback.
 */
async function getFrenchGrammarInfo(rawTranslated) {
  const raw = String(rawTranslated || '').trim();
  const segmentCount = raw.split(/[/;|]+/).map((s) => s.trim()).filter(Boolean).length;
  const disambiguated = segmentCount > 1;

  const lemmaRaw = pickFrenchLemmaForGrammar(rawTranslated);
  const cleaned = normalizeFrenchWord(lemmaRaw || rawTranslated);

  if (!cleaned) {
    return {
      gender: null,
      plural: null,
      lemma: null,
      disambiguated: false,
      source: 'heuristic',
      confidence: 'low'
    };
  }

  const wiktionaryInfo = await getFrenchGrammarFromWiktionary(cleaned);
  let result;
  if (wiktionaryInfo && (wiktionaryInfo.gender || wiktionaryInfo.plural)) {
    result = wiktionaryInfo;
  } else {
    result = getFrenchGrammarHeuristic(cleaned);
  }

  return {
    ...result,
    lemma: cleaned,
    disambiguated: Boolean(disambiguated)
  };
}

/**
 * Try to read gender/plural signals from Wiktionary REST definition payload.
 */
async function getFrenchGrammarFromWiktionary(word) {
  try {
    const response = await axios.get(
      `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`,
      { timeout: 5000 }
    );

    const frenchEntries = response.data?.fr;
    if (!Array.isArray(frenchEntries) || frenchEntries.length === 0) {
      return null;
    }

    let gender = null;
    let plural = null;

    for (const entry of frenchEntries) {
      const part = String(entry.partOfSpeech || '').toLowerCase();
      if (!['noun', 'adjective'].includes(part)) continue;

      const definitions = Array.isArray(entry.definitions) ? entry.definitions : [];
      for (const defObj of definitions) {
        const raw = String(defObj.definition || '');
        const text = stripHtml(raw).toLowerCase();

        if (!gender) {
          if (text.includes('feminine noun') || text.includes('noun feminine') || text.includes('féminin')) {
            gender = 'feminine';
          } else if (text.includes('masculine noun') || text.includes('noun masculine') || text.includes('masculin')) {
            gender = 'masculine';
          }
        }

        if (!plural) {
          const pluralOf = text.match(/plural of\s+([a-zà-ÿ'\-]+)/i);
          if (pluralOf && pluralOf[1]) {
            // current word is plural form already
            plural = word;
          }

          const pluralForm = text.match(/plural\s*:?\s*([a-zà-ÿ'\-]+)/i);
          if (!plural && pluralForm && pluralForm[1]) {
            plural = pluralForm[1];
          }
        }
      }
    }

    // If Wiktionary gave only one field, fill the other via heuristic.
    if (!gender || !plural) {
      const heuristic = getFrenchGrammarHeuristic(word);
      if (!gender) gender = heuristic.gender;
      if (!plural) plural = heuristic.plural;
    }

    return {
      gender,
      plural,
      source: 'wiktionary',
      confidence: gender ? 'medium' : 'low'
    };
  } catch (error) {
    return null;
  }
}

function normalizeFrenchWord(word) {
  return String(word || '')
    .toLowerCase()
    .trim()
    .replace(/^[^a-zA-ZÀ-ÿ]+|[^a-zA-ZÀ-ÿ]+$/g, '');
}

function stripHtml(input) {
  return String(input || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Heuristic fallback for French grammar (gender/plural).
 */
function getFrenchGrammarHeuristic(cleaned) {
  const feminineEndings = ['tion', 'sion', 'té', 'ette', 'ence', 'ance', 'ie', 'ure', 'ude', 'ade'];
  const masculineEndings = ['age', 'ment', 'eau', 'isme', 'oir', 'teur', 'phone'];

  let gender = null;
  let confidence = 'low';

  if (feminineEndings.some((e) => cleaned.endsWith(e))) {
    gender = 'feminine';
    confidence = 'medium';
  } else if (masculineEndings.some((e) => cleaned.endsWith(e))) {
    gender = 'masculine';
    confidence = 'medium';
  } else if (cleaned.endsWith('e')) {
    gender = 'feminine';
    confidence = 'low';
  }

  const alExceptions = ['bal', 'carnaval', 'chacal', 'festival', 'récital', 'régal'];
  let plural = cleaned;

  if (cleaned.endsWith('s') || cleaned.endsWith('x') || cleaned.endsWith('z')) {
    plural = cleaned;
  } else if (cleaned.endsWith('al') && !alExceptions.includes(cleaned)) {
    plural = `${cleaned.slice(0, -2)}aux`;
  } else if (cleaned.endsWith('eau') || cleaned.endsWith('eu') || cleaned.endsWith('au')) {
    plural = `${cleaned}x`;
  } else {
    plural = `${cleaned}s`;
  }

  return {
    gender,
    plural,
    source: 'heuristic',
    confidence
  };
}

/**
 * Generate a contextual example sentence for a word/phrase
 * Creates natural sentences that use the word in context based on word type
 * @param {string} word - The word to generate sentence for
 * @param {string} wordType - Part of speech (noun, verb, adjective, etc.)
 * @param {number} variationIndex - Index to vary the template selection
 */
function generateContextualSentence(word, wordType = null, variationIndex = 0) {
  const lowerWord = word.toLowerCase();
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const startsWithVowel = vowels.includes(lowerWord[0]);
  const article = startsWithVowel ? 'an' : 'a';

  // Detect word type from common patterns if not provided
  if (!wordType) {
    // Common verb endings
    if (lowerWord.endsWith('ing') || lowerWord.endsWith('ed') || lowerWord.endsWith('ize') || lowerWord.endsWith('ate')) {
      wordType = 'verb';
    }
    // Common adjective endings
    else if (lowerWord.endsWith('ful') || lowerWord.endsWith('less') || lowerWord.endsWith('ous') || lowerWord.endsWith('ive') || lowerWord.endsWith('able')) {
      wordType = 'adjective';
    }
    // Common noun endings
    else if (lowerWord.endsWith('tion') || lowerWord.endsWith('sion') || lowerWord.endsWith('ment') || lowerWord.endsWith('ness')) {
      wordType = 'noun';
    }
    // Default to noun for single words
    else {
      wordType = 'noun';
    }
  }

  // For multi-word phrases
  if (word.includes(' ')) {
    const phraseTemplates = [
      `I saw a ${word} yesterday.`,
      `This is a beautiful ${word}.`,
      `I want to buy a ${word}.`,
      `Look at that ${word}!`,
      `Do you like this ${word}?`,
      `Can you show me the ${word}?`,
      `I need a ${word}.`,
      `Where can I find a ${word}?`
    ];
    const index = word.length % phraseTemplates.length;
    return phraseTemplates[index];
  }

  // Generate templates based on word type
  let templates = [];

  if (wordType === 'verb') {
    // Verb templates - more natural verb usage
    templates = [
      `I ${word} every day.`,
      `Can you ${word}?`,
      `Let's ${word} together.`,
      `I want to ${word}.`,
      `She likes to ${word}.`,
      `We should ${word} more often.`,
      `I need to ${word} now.`,
      `They will ${word} tomorrow.`
    ];
  } else if (wordType === 'adjective') {
    // Adjective templates - describe something
    templates = [
      `This is very ${word}.`,
      `That's so ${word}!`,
      `I feel ${word} today.`,
      `It looks ${word}.`,
      `She seems ${word}.`,
      `The weather is ${word}.`,
      `This book is ${word}.`,
      `He is ${word}.`
    ];
  } else {
    // Noun templates (default) - more varied and natural
    templates = [
      `I saw ${article} ${word} yesterday.`,
      `Can you show me the ${word}?`,
      `This is ${article} ${word}.`,
      `I need ${article} ${word}.`,
      `Where is the ${word}?`,
      `I like this ${word}.`,
      `Do you have ${article} ${word}?`,
      `Look at that ${word}!`,
      `The ${word} is here.`,
      `I bought ${article} ${word}.`,
      `This ${word} is beautiful.`,
      `I found the ${word}.`
    ];
  }

  // Use hash of word + variation index to get different templates
  const index = (word.length + variationIndex) % templates.length;
  return templates[index];
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Translation API server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
