import inquirer from 'inquirer';

const askWord = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'englishWord',
      message: 'New word (or type \\q to quit):',
    },
  ]).then(answers => {
    if (answers.englishWord.toLowerCase() !== '\\q') {
      console.log(`You entered: ${answers.englishWord}`);
      askWord(); // Call the function again to ask another question
    } else {
      console.log('Goodbye!');
    }
  });
};

askWord(); // Initial call to start the loop
