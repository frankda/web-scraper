import * as cheerio from 'cheerio';
import express from 'express';
import { fetchHtmlData } from "./utils/requesets.js";
import { PuppeteerScraper } from "./puppeteer.js";
import { extractLinks } from "./utils/parser.js";

const app = express();
const port = 3000;

const vodafone = 'https://www.vodafone.com.au/';
const website = vodafone;

// TODO: Handle website not start with protocol

app.get('/', async (req, res) => {

    // TODO: Handle invalid website URL
    const rootHtml = await fetchHtmlData(website);

    
    const links = extractLinks({ document: rootHtml, domain: website });
    res.json({ links: Array.from(links) });
});

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
  })

async function main() {
    const rootHtml = await fetchHtmlData('https://www.vodafone.com.au/');
    const $ = cheerio.load(rootHtml);

    $('a').each((index, element) => {
        console.log($(element).attr('href'));
    });
}

// main();