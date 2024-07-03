import * as cheerio from 'cheerio';
import express from 'express';
import { fetchHtmlData } from "./utils/requesets.js";
import { scrapeWebsite } from "./puppeteer.js";

const app = express();
const port = 3000;
app.get('/', async (req, res) => {
    // res.send('hello');
    const title = await scrapeWebsite();
    res.send(title);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

async function main() {
    const rootHtml = await fetchHtmlData('https://www.vodafone.com.au/');
    const $ = cheerio.load(rootHtml);

    $('a').each((index, element) => {
        console.log($(element).attr('href'));
    });
}

// main();