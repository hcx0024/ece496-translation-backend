export interface TranslationRequest {
  word: string;
  targetLanguage: string;
  sourceLanguage?: string; // Optional, defaults to 'auto' or 'en'
}

export interface TranslationResponse {
  success: boolean;
  data?: {
    originalWord: string;
    translatedWord: string;
    sourceLanguage: string;
    targetLanguage: string;
  };
  error?: string;
}

export interface SupportedLanguagesResponse {
  success: boolean;
  languages?: Array<{
    code: string;
    name: string;
  }>;
  error?: string;
}
