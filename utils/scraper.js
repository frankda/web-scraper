import { extractLinks, formatUrl, extractContent } from "./parser.js";
import { fetchHtmlData } from "./requesets.js";
import { readContentFromFile, saveStringToFile, appendFile } from './file.js';
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
        
        const html = await fetchHtmlData({ url })
        if (!html) {
            appendFile(url, 'failed.csv');
            return;
        }
        appendFile(url, './urls.csv');

        if (!this.origin) {
            this.origin = new URL(url).origin;
            console.log('Setting origin:', this.origin)
        }

        const fileName = new URL(url).pathname.replace(/\//g, '_');
        const content = extractContent(html);

        // file path has to be relative path to root
        saveStringToFile(content, `/output/txt/${fileName}.txt`);
        saveStringToFile(html, `/output/html/${fileName}.html`);

        console.log('File saved successfully')
        return html;
    }

    async start() {
        const waitList = [];

        const entryHtml = await this.fetchAndSaveContent(this.entryUrl);
        if (!entryHtml) {
            throw new Error('Invalid entry url');
        }

        console.log('origin', this.origin);
        const entryLinks = extractLinks({ document: entryHtml, origin: this.origin });
        this.siteLinks = this.siteLinks.union(entryLinks);
        waitList.push(...entryLinks);

        let i = 0;

        // TODO: Remove condition of i !== 3
        while (waitList.length > 0)  {
            console.log('Remaining waitlist length:', waitList.length);
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

            console.log('Start extracting links from:', url);
            // No html for invalid url
            if (!html) {
                continue;
            }

            const links = extractLinks({ document: html, origin: this.origin });
            console.log('Link extracted successfully')
            const newLinks = links.difference(this.siteLinks);
            this.siteLinks = this.siteLinks.union(newLinks);

            waitList.push(...newLinks);

            await sleep(3000);
        }
        return this.siteLinks
    }
}