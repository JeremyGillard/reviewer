import chalk from 'chalk';
import inquirer from 'inquirer';

export const promptNewWord = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'englishWord',
      message: 'New word (or type \\q to quit, \\r to review):',
    }
  ]);
};

export const promptSentences = () => {
  return inquirer.prompt([
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
  ]);
};

export const promptTranslation = (word) => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'translation',
      message: `Translate this word to English: ${chalk.yellow(word)} (or type \\q to quit, \\a to add new words):`,
    }
  ]);
};

export const promptSentenceTranslation = (sentence) => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'sentenceTranslation',
      message: `Translate this sentence to English: ${chalk.yellow(sentence)}`,
    }
  ]);
};
