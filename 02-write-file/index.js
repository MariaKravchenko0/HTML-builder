const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = process;
const rl = readline.createInterface({ input, output });

const writableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

output.write('Hello! Type your text:\n');

rl.on('line', (data) => {
  if (data.trim().toLowerCase() === 'exit') {
    exitProcess();
  } else {
    writableStream.write(data + '\n');
  }
});

rl.on('SIGINT', () => {
  exitProcess();
});

function exitProcess() {
  output.write('\nThank you! Good luck in studying Node.js!');
  process.exit();
}
