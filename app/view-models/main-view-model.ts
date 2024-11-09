import { Observable } from '@nativescript/core';
import { takePicture, requestPermissions } from '@nativescript/camera';
import { TranslationService } from '../services/translation.service';
import { SpeechService } from '../services/speech.service';

interface Language {
  name: string;
  code: string;
}

export class MainViewModel extends Observable {
  private translationService: TranslationService;
  private speechService: SpeechService;
  private _inputText: string = '';
  private _translatedText: string = '';
  private _isProcessing: boolean = false;
  private _selectedLanguageIndex: number = 0;

  private _languages: Language[] = [
    { name: 'English', code: 'en' },
    { name: 'Spanish', code: 'es' },
    { name: 'French', code: 'fr' },
    { name: 'German', code: 'de' },
    { name: 'Chinese', code: 'zh' },
    { name: 'Japanese', code: 'ja' },
    { name: 'Arabic', code: 'ar' },
    { name: 'Hindi', code: 'hi' }
  ];

  constructor() {
    super();
    this.translationService = new TranslationService();
    this.speechService = new SpeechService();
  }

  get languages(): string[] {
    return this._languages.map(lang => lang.name);
  }

  get selectedLanguageIndex(): number {
    return this._selectedLanguageIndex;
  }

  set selectedLanguageIndex(value: number) {
    if (this._selectedLanguageIndex !== value) {
      this._selectedLanguageIndex = value;
      this.notifyPropertyChange('selectedLanguageIndex', value);
      void this.translateText();
    }
  }

  get currentLanguageCode(): string {
    return this._languages[this._selectedLanguageIndex].code;
  }

  get inputText(): string {
    return this._inputText;
  }

  set inputText(value: string) {
    if (this._inputText !== value) {
      this._inputText = value;
      this.notifyPropertyChange('inputText', value);
      if (value) {
        void this.translateText();
      }
    }
  }

  get translatedText(): string {
    return this._translatedText || 'Translation will appear here';
  }

  set translatedText(value: string) {
    if (this._translatedText !== value) {
      this._translatedText = value;
      this.notifyPropertyChange('translatedText', value);
    }
  }

  get isProcessing(): boolean {
    return this._isProcessing;
  }

  set isProcessing(value: boolean) {
    if (this._isProcessing !== value) {
      this._isProcessing = value;
      this.notifyPropertyChange('isProcessing', value);
    }
  }

  async onCameraCapture() {
    try {
      await requestPermissions();
      const imageAsset = await takePicture({
        width: 1024,
        height: 1024,
        keepAspectRatio: true,
        saveToGallery: false
      });

      if (imageAsset) {
        // Mock OCR result for preview
        this.inputText = "Sample text from image";
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  }

  async translateText() {
    if (!this.inputText) return;

    this.isProcessing = true;
    try {
      const result = await this.translationService.translateText(
        this.inputText,
        this.currentLanguageCode
      );
      this.translatedText = result;
    } catch (error) {
      console.error('Translation error:', error);
      this.translatedText = 'Translation failed';
    } finally {
      this.isProcessing = false;
    }
  }

  async playOriginalText() {
    if (!this.inputText) return;
    await this.speechService.speak(this.inputText, 'en');
  }

  async playTranslatedText() {
    if (!this.translatedText) return;
    await this.speechService.speak(this.translatedText, this.currentLanguageCode);
  }
}