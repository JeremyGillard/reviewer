import axios from 'axios';
import { DEEPL_API_KEY } from './config.mjs';

export const translateText = async (text) => {
  try {
    const response = await axios.post('https://api-free.deepl.com/v2/translate', {
      text: [text], // Ensure text is an array of strings
      target_lang: 'FR'
    }, {
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.translations[0].text;
  } catch (error) {
    console.error('Error translating the text:', error);
    return null;
  }
};
