import fs from 'fs';
import inquirer from 'inquirer';

const askWord = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'englishWord',
      message: 'New word (or type \\q to quit):',
    },
    {
      type: 'input',
      name: 'discoveredSentence',
      message: 'Sentence where the word was discovered:',
      when: (answers) => answers.englishWord.toLowerCase() !== '\\q'
    },
    {
      type: 'input',
      name: 'inventedSentence',
      message: 'Invent a sentence with this word:',
      when: (answers) => answers.englishWord.toLowerCase() !== '\\q'
    }
  ]).then(answers => {
    if (answers.englishWord.toLowerCase() !== '\\q') {
      const data = {
        word: answers.englishWord,
        discoveredSentence: answers.discoveredSentence,
        inventedSentence: answers.inventedSentence
      };

      // Append the data to a JSON file
      fs.readFile('words.json', (err, fileData) => {
        if (err && err.code !== 'ENOENT') throw err;

        const json = fileData ? JSON.parse(fileData) : [];
        json.push(data);

        fs.writeFile('words.json', JSON.stringify(json, null, 2), (err) => {
          if (err) throw err;
          console.log('Data saved to words.json');
        });
      });

      console.log(`You entered: ${answers.englishWord}`);
      askWord(); // Call the function again to ask another question
    } else {
      console.log('Goodbye!');
    }
  });
};

askWord(); // Initial call to start the loop
