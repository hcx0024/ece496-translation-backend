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
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      translate: 'POST /api/translate',
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Translation API server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
