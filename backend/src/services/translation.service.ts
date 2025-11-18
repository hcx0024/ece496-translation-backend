import axios from 'axios';

/**
 * Translation Service
 * Uses LibreTranslate - a free, open-source translation API
 * Alternative: You can switch to Google Translate API for production
 */
class TranslationService {
  private libreTranslateUrl: string;

  constructor() {
    // Using public LibreTranslate instance (free, no API key needed)
    // You can also self-host LibreTranslate or use other services
    this.libreTranslateUrl = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';
  }

  /**
   * Translate a word from source language to target language
   */
  async translateWord(
    word: string,
    targetLanguage: string,
    sourceLanguage: string = 'auto'
  ): Promise<{ translatedWord: string; detectedLanguage: string }> {
    try {
      // Try LibreTranslate first
      const response = await axios.post(
        `${this.libreTranslateUrl}/translate`,
        {
          q: word,
          source: sourceLanguage === 'auto' ? 'en' : sourceLanguage,
          target: targetLanguage,
          format: 'text'
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 10000 // 10 second timeout
        }
      );

      return {
        translatedWord: response.data.translatedText,
        detectedLanguage: response.data.detectedLanguage?.language || sourceLanguage
      };
    } catch (error) {
      // If LibreTranslate fails, try MyMemory Translation API (free, no key needed)
      console.log('LibreTranslate failed, trying MyMemory API...');
      return this.translateWithMyMemory(word, targetLanguage, sourceLanguage);
    }
  }

  /**
   * Fallback translation using MyMemory API (free, no API key needed)
   */
  private async translateWithMyMemory(
    word: string,
    targetLanguage: string,
    sourceLanguage: string = 'auto'
  ): Promise<{ translatedWord: string; detectedLanguage: string }> {
    try {
      const langPair = sourceLanguage === 'auto'
        ? `en|${targetLanguage}`
        : `${sourceLanguage}|${targetLanguage}`;

      const response = await axios.get(
        `https://api.mymemory.translated.net/get`,
        {
          params: {
            q: word,
            langpair: langPair
          },
          timeout: 10000
        }
      );

      if (response.data.responseStatus === 200 || response.data.responseData) {
        return {
          translatedWord: response.data.responseData.translatedText,
          detectedLanguage: sourceLanguage === 'auto' ? 'en' : sourceLanguage
        };
      }

      throw new Error('Translation failed');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Translation failed: ${error.message}`);
      }
      throw new Error('Translation service error');
    }
  }

  /**
   * Get list of supported languages
   */
  async getSupportedLanguages(): Promise<Array<{ code: string; name: string }>> {
    try {
      const response = await axios.get(`${this.libreTranslateUrl}/languages`, {
        timeout: 5000
      });

      return response.data.map((lang: any) => ({
        code: lang.code,
        name: lang.name
      }));
    } catch (error) {
      // Return common languages as fallback
      return this.getCommonLanguages();
    }
  }

  /**
   * Fallback list of common languages
   */
  private getCommonLanguages(): Array<{ code: string; name: string }> {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'it', name: 'Italian' },
      { code: 'pt', name: 'Portuguese' },
      { code: 'ru', name: 'Russian' },
      { code: 'ja', name: 'Japanese' },
      { code: 'ko', name: 'Korean' },
      { code: 'zh', name: 'Chinese' },
      { code: 'ar', name: 'Arabic' },
      { code: 'hi', name: 'Hindi' }
    ];
  }
}

export default new TranslationService();
