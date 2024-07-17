import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function saveStringToFile(htmlContent, filePath = 'output.txt') {
    try {
      const outputFolder = path.join(__dirname, 'output');
      const absoluteFilePath = path.join(__dirname, filePath);

      if (!fs.existsSync(outputFolder)) {
          // If the folder does not exist, create it
          fs.mkdirSync(outputFolder, { recursive: true });
      }

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