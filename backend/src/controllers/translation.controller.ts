import { Request, Response } from 'express';
import translationService from '../services/translation.service';
import { TranslationRequest, TranslationResponse, SupportedLanguagesResponse } from '../types/translation.types';

/**
 * Controller for translation endpoints
 */
class TranslationController {
  /**
   * POST /api/translate
   * Translate a word to target language
   */
  async translate(req: Request, res: Response): Promise<void> {
    try {
      const { word, targetLanguage, sourceLanguage = 'auto' } = req.body as TranslationRequest;

      // Validation
      if (!word || !targetLanguage) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: word and targetLanguage are required'
        } as TranslationResponse);
        return;
      }

      if (typeof word !== 'string' || word.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid word: must be a non-empty string'
        } as TranslationResponse);
        return;
      }

      if (typeof targetLanguage !== 'string' || targetLanguage.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid targetLanguage: must be a non-empty string'
        } as TranslationResponse);
        return;
      }

      // Perform translation
      const result = await translationService.translateWord(
        word.trim(),
        targetLanguage.toLowerCase(),
        sourceLanguage.toLowerCase()
      );

      // Send response
      res.json({
        success: true,
        data: {
          originalWord: word.trim(),
          translatedWord: result.translatedWord,
          sourceLanguage: result.detectedLanguage,
          targetLanguage: targetLanguage.toLowerCase()
        }
      } as TranslationResponse);

    } catch (error) {
      console.error('Translation error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Translation failed'
      } as TranslationResponse);
    }
  }

  /**
   * GET /api/translate/languages
   * Get list of supported languages
   */
  async getSupportedLanguages(req: Request, res: Response): Promise<void> {
    try {
      const languages = await translationService.getSupportedLanguages();

      res.json({
        success: true,
        languages
      } as SupportedLanguagesResponse);

    } catch (error) {
      console.error('Error fetching languages:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch supported languages'
      } as SupportedLanguagesResponse);
    }
  }
}

export default new TranslationController();
