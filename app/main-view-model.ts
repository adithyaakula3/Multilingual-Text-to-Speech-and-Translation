import { Observable } from '@nativescript/core';
import { TranslationService } from './services/translation.service';
import { SpeechService } from './services/speech.service';

export class MainViewModel extends Observable {
    private translationService: TranslationService;
    private speechService: SpeechService;

    private _inputText: string = '';
    private _translatedText: string = '';
    private _languages: string[] = [];
    private _selectedLanguageIndex: number = 0;

    constructor() {
        super();
        this.translationService = new TranslationService();
        this.speechService = new SpeechService();
        
        this._languages = this.translationService.getSupportedLanguages()
            .map(lang => lang.name);
    }

    get inputText(): string {
        return this._inputText;
    }

    set inputText(value: string) {
        if (this._inputText !== value) {
            this._inputText = value;
            this.notifyPropertyChange('inputText', value);
        }
    }

    get translatedText(): string {
        return this._translatedText;
    }

    set translatedText(value: string) {
        if (this._translatedText !== value) {
            this._translatedText = value;
            this.notifyPropertyChange('translatedText', value);
        }
    }

    get languages(): string[] {
        return this._languages;
    }

    get selectedLanguageIndex(): number {
        return this._selectedLanguageIndex;
    }

    set selectedLanguageIndex(value: number) {
        if (this._selectedLanguageIndex !== value) {
            this._selectedLanguageIndex = value;
            this.notifyPropertyChange('selectedLanguageIndex', value);
        }
    }

    async onTranslate() {
        if (!this.inputText) return;

        const targetLang = this.translationService.getSupportedLanguages()[this.selectedLanguageIndex].code;
        this.translatedText = await this.translationService.translateText(this.inputText, targetLang);
    }

    async onSpeakInput() {
        await this.speechService.speak(this.inputText, 'en');
    }

    async onSpeakTranslation() {
        if (!this.translatedText) return;
        const targetLang = this.translationService.getSupportedLanguages()[this.selectedLanguageIndex].code;
        await this.speechService.speak(this.translatedText, targetLang);
    }

    onCapture() {
        // Mock camera capture
        this.inputText = "Sample captured text";
    }
}