// Assuming the necessary imports are already in place

// Import the function to test
import { extractLinks } from '/Users/frank.da/personal/web-scraper/utils/parser.js';

const mockHtml = `#34;src&#34;: &#34;https://www.vodafone.com.au/images/icons/bundles-red.svg&#34;,
    34;: &#34;https://www.vodafone.com.au/mobile/bundle-and-save&#34;,
    &#34;href&#34;: &#34;https://www.vodafone.com.au/support/home-internet/nbn-troubleshooting&#34;,
              &#34;label&#34;: &#34;nbn troubleshooting&#34;,href="https://www.vodafone.com.au/contact/samsung-news"
`

describe('extractLinks', () => {
    test('should correctly extract multiple unique links', () => {
        const expected = new Set([
            'https://www.vodafone.com.au/mobile/bundle-and-save',
            'https://www.vodafone.com.au/support/home-internet/nbn-troubleshooting',
            'https://www.vodafone.com.au/contact/samsung-news'
        ]);
        expect(extractLinks({ document: mockHtml, domain: 'www.vodafone.com.au'})).toEqual(expected);
    });

    test('should handle duplicates by not adding them to the set', () => {
        const document = 'Visit "https://example.com", https://example.com" for more info.';
        const expected = new Set(['https://example.com']);
        expect(extractLinks({document, domain: 'example.com'})).toEqual(expected);
    });

    // test('should extract links from a complex string', () => {
    //     const document = 'Text before https://example.com, text in between, https://another-example.com, and text after.';
    //     const expected = new Set(['https://example.com', 'https://another-example.com']);
    //     expect(extractLinks(document)).toEqual(expected);
    // });

    // test('should return an empty set when no links are present', () => {
    //     const document = 'No links here!';
    //     const expected = new Set();
    //     expect(extractLinks(document)).toEqual(expected);
    // });

    // test('should return an empty set when input is not a string', () => {
    //     const document = null;
    //     const expected = new Set();
    //     expect(extractLinks(document)).toEqual(expected);
    // });
});