import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import inquirer from 'inquirer';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

// Define the schema for environment variables
const envSchema = z.object({
  DEEPL_API_KEY: z.string().nonempty('DEEPL_API_KEY is required')
});

// Parse and validate the environment variables
const env = envSchema.parse(process.env);

const DEEPL_API_KEY = env.DEEPL_API_KEY;

const translateText = async (text) => {
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

const askWord = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'englishWord',
      message: 'New word (or type \\q to quit):',
    }
  ]).then(async answers => {
    if (answers.englishWord.toLowerCase() !== '\\q') {
      const wordTranslation = await translateText(answers.englishWord);
      console.log(`Translation: ${wordTranslation}`);

      inquirer.prompt([
        {
          type: 'input',
          name: 'discoveredSentence',
          message: 'Sentence where the word was discovered:',
        },
        {
          type: 'input',
          name: 'inventedSentence',
          message: 'Invent a sentence with this word:',
        }
      ]).then(async answers2 => {
        const discoveredSentenceTranslation = await translateText(answers2.discoveredSentence);
        const inventedSentenceTranslation = await translateText(answers2.inventedSentence);

        const data = {
          word: answers.englishWord,
          translation: wordTranslation,
          discoveredSentence: answers2.discoveredSentence,
          discoveredSentenceTranslation: discoveredSentenceTranslation,
          inventedSentence: answers2.inventedSentence,
          inventedSentenceTranslation: inventedSentenceTranslation
        };

        // Append the data to a JSON file
        fs.readFile('words.json', (err, fileData) => {
          if (err && err.code !== 'ENOENT') throw err;

          const json = fileData ? JSON.parse(fileData) : [];
          json.push(data);

          fs.writeFile('words.json', JSON.stringify(json, null, 2), (err) => {
            if (err) throw err;
            console.log('Data saved to words.json');
            askWord(); // Call the function again to ask another question
          });
        });
      });
    } else {
      console.log('Goodbye!');
      // Close the file properly
      fs.closeSync(fs.openSync('words.json', 'r'));
    }
  });
};

askWord(); // Initial call to start the loop
