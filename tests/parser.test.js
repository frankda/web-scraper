// Assuming the necessary imports are already in place

// Import the function to test
import { extractLinks, validateURL } from '../utils/parser.js';

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
        expect(extractLinks({ document: mockHtml, origin: 'https://www.vodafone.com.au'})).toEqual(expected);
    });

    test('should handle duplicates by not adding them to the set', () => {
        const document = 'Visit "https://example.com", https://example.com" for more info.';
        const expected = new Set(['https://example.com']);
        expect(extractLinks({document, origin: 'https://example.com'})).toEqual(expected);
    });

    // test('should extract links from a complex string', () => {
    //     const document = '#vodafone-content\" class=\"vodafone-skip-link';
    //     const expected = new Set(['https://example.com', 'https://another-example.com']);
    //     expect(extractLinks({document, domain: 'https://example.com'})).toEqual(expected);
    // });

    // test('different protocol', () => {
    //     const document = 'No links here!';
    //     const expected = new Set();
    //     expect(extractLinks(document)).toEqual(expected);
    // });

    // test('invalid url', () => {
    //     const document = null;
    //     const expected = new Set();
    //     expect(extractLinks(document)).toEqual(expected);
    // });

    /**
     * TDOO: Test cases
     * - should strip off search params
     * - should strip off hash
     */
});

describe('validateURL', () => {
    test('throws an error if URL includes a pathname', () => {
        const testURL = 'https://example.com/pathname';
        expect(() => validateURL(testURL)).toThrow('Invalid origin format, has to be a valid for URL(url), consist of schema + hostname: ' + testURL);
    });

    test('throws an error for invalid URL format', () => {
        const invalidURL = 'invalid://example';
        expect(() => validateURL(invalidURL)).toThrow('Invalid origin format, has to be a valid for URL(url), consist of schema + hostname: ' + invalidURL);
    });

    test('does not throw an error for valid root URL', () => {
        const validURL = 'https://example.com';
        expect(() => validateURL(validURL)).not.toThrow();
    });
});