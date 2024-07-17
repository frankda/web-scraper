import * as cheerio from 'cheerio';
import express from 'express';
import { fetchHtmlData } from "./utils/requesets.js";
import { PuppeteerScraper } from "./puppeteer.js";
import { extractLinks } from "./utils/parser.js";
import { Scraper } from "./utils/scraper.js";
import { saveStringToFile } from "./utils/file.js";

const app = express();
const port = 3000;

// TODO: Handle website not start with protocol
const vodafone = 'https://www.vodafone.com.au';
const website = vodafone;


app.get('/', async (req, res) => {
    const scraper = new Scraper({ entryUrl: website });
    const links = await scraper.start();

    // TODO: Handle invalid website URL
    // const rootHtml = await fetchHtmlData(website);
    // const $ = cheerio.load(rootHtml);
    // const fullHTML = $.html();
    // console.log(fullHTML)

    // saveStringToFile(rootHtml);

    // const links = extractLinks({ document: rootHtml, origin: website });
    // const fetchedLinks = new Set([website]);

    res.json({ links: [...links] });
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