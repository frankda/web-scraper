import fs from 'fs/promises';

export async function saveStringToFile(htmlContent, filePath = 'output.txt') {
    try {
      await fs.writeFile(filePath, htmlContent, 'utf-8');
      console.log('File has been saved.');
    } catch (error) {
      console.error('Error saving the file:', error);
    }
}

export async function readContentFromFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content; // Return the content of the file
    } catch (error) {
      console.error('Error reading the file:', error);
      return null; // Return null in case of an error
    }
}