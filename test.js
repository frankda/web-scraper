import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs'
import { extractLinks } from './utils/parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const a = '/output/name.txt'

const html = fs.readFileSync(__dirname + '/tests/html/support_home-internet_5g-troubleshooting.html', 'utf8');
const links = extractLinks({document: html, origin: 'https://www.vodafone.com.au'})

console.log(links)