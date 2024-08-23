#!/usr/bin/env node

import chalk from 'chalk';
import { readJson, writeJson } from './fileHandler.mjs';
import { promptNewSentence, promptSentenceTranslation, promptTranslation, promptWord } from './prompts.mjs';
import { translateText } from './translator.mjs';

const addSentence = async () => {
  const sentenceAnswer = await promptNewSentence();

  if (sentenceAnswer.sentence.toLowerCase() === '\\q') {
    console.log('Goodbye!');
  } else if (sentenceAnswer.sentence.toLowerCase() === '\\r') {
    await reviewWords();
  } else {
    const sentenceTranslation = await translateText(sentenceAnswer.sentence);
    console.log(`Sentence Translation: ${chalk.yellow(sentenceTranslation)}`);

    const wordAnswer = await promptWord();
    const wordTranslation = await translateText(wordAnswer.word);
    console.log(`Word Translation: ${chalk.yellow(wordTranslation)}`);

    const data = {
      sentence: sentenceAnswer.sentence,
      sentenceTranslation: sentenceTranslation,
      word: wordAnswer.word,
      wordTranslation: wordTranslation,
      index: 0,
      creationDate: new Date().toISOString(),
      reviewedDate: new Date().toISOString()
    };

    const fileData = await readJson();
    const json = fileData ? fileData : [];
    json.push(data);

    await writeJson(json);
    console.log('Data saved to words.json');
    addSentence(); // Call the function again to ask another question
  }
};

const reviewWords = async () => {
  const fileData = await readJson();
  if (!fileData) {
    console.log('No words to review.');
    await addSentence();
  } else {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const words = fileData.filter(word => word.index !== -1 || new Date(word.reviewedDate) < oneMonthAgo);

    words.sort((a, b) => b.index - a.index);

    let index = 0;

    const reviewNextWord = async () => {
      if (index < words.length) {
        const word = words[index];
        const answers = await promptSentenceTranslation(word.sentenceTranslation);

        if (answers.sentenceTranslation.toLowerCase() === '\\q') {
          console.log('Goodbye!');
        } else if (answers.sentenceTranslation.toLowerCase() === '\\a') {
          await addSentence();
        } else if (answers.sentenceTranslation.toLowerCase() === word.sentence.toLowerCase()) {
          console.log(chalk.green('✅ Correct!'));
          word.index = Math.max(word.index - 1, -1);
          word.reviewedDate = new Date().toISOString();
        } else {
          console.log(chalk.blue(`💭 Incorrect. The correct translation is: ${chalk.white(word.sentence)}`));
          const answers2 = await promptTranslation(word.wordTranslation);

          if (answers2.translation.toLowerCase() === word.word.toLowerCase()) {
            console.log(chalk.green('✅ Correct!'));
          } else {
            console.log(chalk.blue(`💭 Incorrect. The correct translation is: ${chalk.white(word.word)}`));
            word.index++;
          }

          word.reviewedDate = new Date().toISOString();
        }

        const fileData = await readJson();
        const json = fileData ? fileData : [];
        const wordIndex = json.findIndex(w => w.sentence === word.sentence);
        if (wordIndex !== -1) {
          json[wordIndex] = word;
        }

        await writeJson(json);
        index++;
        await reviewNextWord();
      } else {
        console.log('Review completed.');
        await addSentence();
      }
    };

    await reviewNextWord();
  }
};

addSentence(); // Initial call to start the loop
