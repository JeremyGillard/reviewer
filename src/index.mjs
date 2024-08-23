import chalk from 'chalk';
import { readJson, writeJson } from './file.mjs';
import { promptNewWord, promptSentences, promptSentenceTranslation, promptTranslation } from './prompts.mjs';
import { translateText } from './translator.mjs';

const addWord = async () => {
  const answers = await promptNewWord();

  if (answers.englishWord.toLowerCase() === '\\q') {
    console.log('Goodbye!');
  } else if (answers.englishWord.toLowerCase() === '\\r') {
    await reviewWords();
  } else {
    const wordTranslation = await translateText(answers.englishWord);
    console.log(`Translation: ${chalk.yellow(wordTranslation)}`);

    const answers2 = await promptSentences();
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

    const fileData = await readJson('words.json');
    const json = fileData ? fileData : [];
    json.push(data);

    await writeJson('words.json', json);
    console.log('Data saved to words.json');
    addWord(); // Call the function again to ask another question
  }
};

const reviewWords = async () => {
  const fileData = await readJson('words.json');
  if (!fileData) {
    console.log('No words to review.');
    await addWord();
  } else {
    const words = fileData;
    let index = 0;

    const reviewNextWord = async () => {
      if (index < words.length) {
        const word = words[index];
        const answers = await promptTranslation(word.translation);

        if (answers.translation.toLowerCase() === '\\q') {
          console.log('Goodbye!');
          closeFile('words.json');
        } else if (answers.translation.toLowerCase() === '\\a') {
          await addWord();
        } else if (answers.translation.toLowerCase() === word.word.toLowerCase()) {
          console.log(chalk.green('✅ Correct!'));
          index++;
          await reviewNextWord();
        } else {
          console.log(chalk.blue(`💭 Incorrect. The correct translation is: ${chalk.white(word.word)}`));
          const answers2 = await promptSentenceTranslation(word.discoveredSentenceTranslation);

          if (answers2.sentenceTranslation.toLowerCase() === word.discoveredSentence.toLowerCase()) {
            console.log(chalk.green('✅ Correct!'));
          } else {
            console.log(chalk.blue(`💭 Incorrect. The correct translation is: ${chalk.white(word.discoveredSentence)}`));
          }

          const answers3 = await promptSentenceTranslation(word.inventedSentenceTranslation);

          if (answers3.sentenceTranslation.toLowerCase() === word.inventedSentence.toLowerCase()) {
            console.log(chalk.green('✅ Correct!'));
          } else {
            console.log(chalk.blue(`💭 Incorrect. The correct translation is: ${chalk.white(word.inventedSentence)}`));
          }

          index++;
          await reviewNextWord();
        }
      } else {
        console.log('Review completed.');
        await addWord();
      }
    };

    await reviewNextWord();
  }
};

addWord(); // Initial call to start the loop
