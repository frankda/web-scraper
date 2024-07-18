import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs'
import { extractLinks } from './utils/parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const a = '/output/name.txt'

// const html = fs.readFileSync(__dirname + '/tests/html/support_home-internet_5g-troubleshooting.html', 'utf8');
// const links = extractLinks({document: html, origin: 'https://www.vodafone.com.au'})

// console.log(links)

const inputDir = path.join(__dirname, './utils/output/txt');
const outputFile = path.join(__dirname, 'combined.txt');

fs.writeFileSync(outputFile, '');

fs.readdir(inputDir, (err, files) => {
  if (err) {
    return console.error('Failed to list directory:', err);
  }

  files.forEach(file => {
    const filePath = path.join(inputDir, file);
    // Check if the current path is a file and not a directory
    if (fs.statSync(filePath).isFile()) {
      const content = fs.readFileSync(filePath, 'utf8');
      // Append the content of the current file to the combined file
      fs.appendFileSync(outputFile, content + '\n');
    }
  });

});

// console.log(inputDir)