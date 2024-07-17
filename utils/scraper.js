import { extractLinks, formatUrl, extractContent } from "./parser.js";
import { fetchHtmlData } from "./requesets.js";
import { readContentFromFile, saveStringToFile } from './file.js';
import { sleep } from './general.js';

export class Scraper {
    constructor({ entryUrl }) {
        this.entryUrl = entryUrl;
        this.fetchedUrl = new Set();
        this.failedUrl = new Set();
        this.siteLinks = new Set();
        try {
            this.origin = new URL(entryUrl).origin;
        } catch (error) {
            throw('Invalid origin format, has to be a valid for URL(url), consist of schema + hostname + pathName', origin)
        }
    }
    
    async fetchAndSaveContent(url) {
        if (this.fetchedUrl.has(url)) {
            return;
        }
        this.fetchedUrl.add(url);

        const html = await fetchHtmlData(url)
        if (!html) {
            return;
        }

        if (!this.origin) {
            this.origin = new URL(url).origin;
        }

        const fileName = new URL(url).pathname.replace(/\//g, '_');
        const content = extractContent(html);

        // file path has to be relative path to root
        saveStringToFile(content, `/output/${fileName}.txt`);
        saveStringToFile(html, `/output/${fileName}.html`);

        return html;
    }

    async start() {
        const waitList = [];

        const entryHtml = await this.fetchAndSaveContent(this.entryUrl);
        const entryLinks = extractLinks({ document: entryHtml, origin: this.origin });
        this.siteLinks = this.siteLinks.union(entryLinks);
        waitList.push(...entryLinks);

        let i = 0;

        // TODO: Remove condition of i !== 3
        while (waitList.length > 0 && i !== 10)  {
            i += 1;
            // TODO: Consider use pop() for better performance
            const url = waitList.shift();
            if (this.fetchedUrl.has(url)) {
                continue;
            }

            console.log('\n', i);
            let html;

            try {
                html = await this.fetchAndSaveContent(url);
            } catch (error) {
                console.error('Error:', error);
                this.failedUrl.add(url);
            }

            // No html for invalid url
            if (!html) {
                continue;
            }

            const links = extractLinks({ document: html, origin: this.origin });
            const newLinks = links.difference(this.siteLinks);
            this.siteLinks = this.siteLinks.union(newLinks);

            waitList.push(...newLinks);

            await sleep(1000);
        }
        return this.siteLinks
    }
}