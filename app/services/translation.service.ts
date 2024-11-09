import { Observable } from '@nativescript/core';

export class TranslationService extends Observable {
    private supportedLanguages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'zh', name: 'Chinese' }
    ];

    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    async translateText(text: string, targetLang: string): Promise<string> {
        // Mock translation for demo
        return `[${targetLang}] ${text}`;
    }
}