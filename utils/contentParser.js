import TurndownService from 'turndown';
import { readContentFromFile, saveStringToFile } from './file.js';

const turndownService = new TurndownService()

// match all text between curly braces, curly braces included
const invalidTxtExp = new RegExp(`^<vha.*^(^</vha.*>$)$`, 'g');

// match all web-components tags like <vha-slot>test</vha-slot>
const vhaTagEXp = new RegExp(`<vha.*?(?:<\/vha.*?>)`, 'gms');

const filePath = './output.txt';

readContentFromFile(filePath).then(content => {
    const fileContent = content;
    const markdown = turndownService.turndown(fileContent)

    saveStringToFile(markdown, 'cleaned.txt');
});

