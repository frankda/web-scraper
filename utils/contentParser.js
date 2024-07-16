import * as cheerio from 'cheerio';
import { readContentFromFile, saveStringToFile } from './file.js';

// match all text between curly braces, curly braces included
const invalidTxtExp = new RegExp(`^<vha.*^(^</vha.*>$)$`, 'g');

// match all web-components tags like <vha-slot>test</vha-slot>
const vhaTagEXp = new RegExp(`<vha.*?(?:<\/vha.*?>)`, 'gms');

const filePath = './output.txt';

readContentFromFile(filePath).then(content => {
    const fileContent = content;
    const cleanContent = fileContent.replace(vhaTagEXp, '');

    saveStringToFile(cleanContent, 'cleaned.txt');
});