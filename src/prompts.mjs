import chalk from 'chalk';
import inquirer from 'inquirer';

export const promptNewSentence = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'sentence',
      message: 'Enter the sentence context (or type \\q to quit, \\r to review):',
    }
  ]);
};

export const promptWord = () => {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'word',
      message: 'Enter the word you don\'t understand:',
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
