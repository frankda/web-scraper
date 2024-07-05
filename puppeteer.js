import puppeteer from 'puppeteer';

export class PuppeteerScraper {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async launchBrowser() {
        this.browser = await puppeteer.launch();
        console.log('Browser launched')
        this.page = await this.browser.newPage();
        console.log('New page created')
    }

    async getHtml(url) {
        console.log('Navigating to:', url)
        await this.page.goto(url, { waitUntil: 'networkidle0' });
        console.log('Waiting for 2 seconds')
        await this.page.evaluate(async() => {
            await new Promise(function(resolve) { 
                   setTimeout(resolve, 2000)
            });
        });
        return await this.page.content();
    }

    async closeBrowser() {
        await this.browser.close();
    }
}

