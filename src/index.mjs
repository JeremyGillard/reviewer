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

const askWord = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'englishWord',
      message: 'New word (or type \\q to quit):',
    }
  ]).then(async answers => {
    if (answers.englishWord.toLowerCase() !== '\\q') {
      try {
        // Translate the word using DeepL API
        const response = await axios.post('https://api-free.deepl.com/v2/translate', {
          text: [answers.englishWord],
          target_lang: 'FR'
        }, {
          headers: {
            'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        const translation = response.data.translations[0].text;
        console.log(`Translation: ${translation}`);

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
        ]).then(answers2 => {
          const data = {
            word: answers.englishWord,
            translation: translation,
            discoveredSentence: answers2.discoveredSentence,
            inventedSentence: answers2.inventedSentence
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
      } catch (error) {
        console.error('Error translating the word:', error);
      }
    } else {
      console.log('Goodbye!');
      // Close the file properly
      fs.closeSync(fs.openSync('words.json', 'r'));
    }
  });
};

askWord(); // Initial call to start the loop
