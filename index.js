import * as cheerio from 'cheerio';
import express from 'express';
import { fetchHtmlData } from "./utils/requesets.js";
import { PuppeteerScraper } from "./puppeteer.js";
import { extractLinks } from "./utils/parser.js";

const app = express();
const port = 3000;
app.get('/', async (req, res) => {
    // const scraper = new PuppeteerScraper();
    // await scraper.launchBrowser();
    // const html = await scraper.getHtml('https://www.vodafone.com.au/');

    const rootHtml = await fetchHtmlData('https://www.vodafone.com.au/');

    
    const links = extractLinks({ document: rootHtml, domain: 'https://www.vodafone.com.au' });
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