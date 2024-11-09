import { Observable, Http } from '@nativescript/core';
import { TNSTextToSpeech, SpeakOptions } from 'nativescript-texttospeech';

export class LanguageService extends Observable {
  private tts: TNSTextToSpeech;

  constructor() {
    super();
    this.tts = new TNSTextToSpeech();
  }

  async translateText(text: string, targetLang: string): Promise<string> {
    try {
      const response = await Http.request({
        url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`,
        method: 'GET'
      });
      
      const data = response.content.toJSON();
      return data[0][0][0];
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }

  async speak(text: string, lang: string): Promise<void> {
    const options: SpeakOptions = {
      text: text,
      locale: lang,
      pitch: 1.0,
      speakRate: 1.0
    };

    try {
      await this.tts.speak(options);
    } catch (error) {
      console.error('TTS error:', error);
    }
  }
}