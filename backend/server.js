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
