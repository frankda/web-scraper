import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function recursiveCreateDirForFilePath(filePath) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  try {
    const absoluteFilePath = path.join(__dirname, filePath);
    const outputFolder = path.dirname(absoluteFilePath);

    if (!fs.existsSync(outputFolder)) {
        // If the folder does not exist, create it
        fs.mkdirSync(outputFolder, { recursive: true });
    }

    return absoluteFilePath
  } catch (error) {
    console.error('Error creating the folder:', error);
  }
}

export async function saveStringToFile(htmlContent, filePath = 'output.txt') {
  const absoluteFilePath = recursiveCreateDirForFilePath(filePath);

  try {
    fs.writeFileSync(absoluteFilePath, htmlContent, 'utf-8');
    console.log(`File has been saved to ${absoluteFilePath}`);
  } catch (error) {
    console.error('Error saving the file:', error);
  }
}

export function readContentFromFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return content; // Return the content of the file
    } catch (error) {
      console.error('Error reading the file:', error);
      return null; // Return null in case of an error
    }
}

/**
 * Add content to a file, reconmended for appending URLs to a CSV file.
 * @param {string} url 
 * @param {string} filePath 
 */
export function appendFile(url, filePath) {
  const aboluteFilePath = recursiveCreateDirForFilePath(filePath);

  fs.appendFile(aboluteFilePath, `${url}\n`, (err) => {
    if (err) {
      console.error('Error appending URL to CSV file:', err);
    }
  });
}

function combineFiles(inputDir, outputFile) {
  const outputFilePath = recursiveCreateDirForFilePath(inputDir);
  fs.writeFileSync(outputFilePath, '');

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
}
