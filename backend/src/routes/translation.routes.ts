import { Router } from 'express';
import translationController from '../controllers/translation.controller';

const router = Router();

/**
 * POST /api/translate
 * Translate a word to target language
 *
 * Request body:
 * {
 *   "word": "hello",
 *   "targetLanguage": "es",
 *   "sourceLanguage": "en" // optional, defaults to "auto"
 * }
 */
router.post('/', translationController.translate);

/**
 * GET /api/translate/languages
 * Get list of supported languages
 */
router.get('/languages', translationController.getSupportedLanguages);

export default router;
