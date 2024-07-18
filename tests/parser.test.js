import fs from 'fs';

// Import the function to test
import { extractLinks, validateURL, removeNonContentTags } from '../utils/parser.js';

const mockHtml = `
&#34;pageEventAttributeTwo&#34;: &#34;https://www.vodafone.com.au/mobile/mobile-phones&#34;"
<a href="https://www.vodafone.com.au/iphone-15">Vodafone</a>
<a href="//www.vodafone.com.au/apple">Vodafone</a>
<a href="/hubbl">Vodafone</a>
<a href="https://www.vodafone.com.au/cart?test">Vodafone</a>
<a href="https://www.vodafone.com.au/hash#test">Vodafone</a>
<a href="/relative-hash#test">Vodafone</a>
<a href="/relative-query?test">Vodafone</a>
34;: &#34;https://www.vodafone.com.au/image.svg&#34;
34;: &#34;https://www.vodafone.com.au/image.jpg&#34;
34;: &#34;https://www.vodafone.com.au/image.png&#34;
34;: &#34;https://www.vodafone.com.au/image.zip&#34;
34;: &#34;https://www.vodafone.com.au/image.md&#34;
34;: &#34;https://www.vodafone.com.au/image.ico&#34;
34;: &#34;https://www.vodafone.com.au/image.pdf&#34;
34;: &#34;https://www.vodafone.com.au/image.txt&#34;
34;: &#34;https://www.vodafone.com.au/image.webp&#34;
34;: &#34;https://www.vodafone.com.au/image.woff&#34;
34;: &#34;https://www.vodafone.com.au/image.ttf&#34;
34;: &#34;https://www.vodafone.com.au/image\\&#34;
34;: &#34;https://www.vodafone.com.au/tel:1234567890&#34;
34;: &#34;https://www.vodafone.com.au/mailto:
34;: &#34;https://www.vodafone.com.au/data:image&#34;
34;: &#34;https://www.vodafone.com.au/javascript:alert('hello')&#34;
&#34;/samsung&#34;
`

describe('extractLinks', () => {
    test('should correctly extract multiple unique links', () => {
        const expected = new Set([
            'https://www.vodafone.com.au',
            'https://www.vodafone.com.au/mobile/mobile-phones',
            'https://www.vodafone.com.au/iphone-15',
            'https://www.vodafone.com.au/hubbl',
            'https://www.vodafone.com.au/cart',
            'https://www.vodafone.com.au/hash',
            'https://www.vodafone.com.au/relative-hash',
            'https://www.vodafone.com.au/relative-query',
        ]);
        expect(extractLinks({ document: mockHtml, origin: 'https://www.vodafone.com.au'})).toEqual(expected);
    });
    /**
     * TDOO: Test cases
     * - should strip off search params
     * - should strip off hash
     */
});

// describe('validateURL', () => {
//     test('throws an error if URL includes a pathname', () => {
//         const testURL = 'https://example.com/pathname';
//         expect(() => validateURL(testURL)).toThrow('Invalid origin format, has to be a valid for URL(url), consist of schema + hostname: ' + testURL);
//     });

//     test('throws an error for invalid URL format', () => {
//         const invalidURL = 'invalid://example';
//         expect(() => validateURL(invalidURL)).toThrow('Invalid origin format, has to be a valid for URL(url), consist of schema + hostname: ' + invalidURL);
//     });

//     test('does not throw an error for valid root URL', () => {
//         const validURL = 'https://example.com';
//         expect(() => validateURL(validURL)).not.toThrow();
//     });
// });

describe('extractContent', () => {
    test('remove <script>, <style> from HTML', () => {
        // TODO: use path alias or relative path
        const html = fs.readFileSync('./tests/html/accessories_smart-watches.html', 'utf-8');
        const cleanedHtml = removeNonContentTags(html);
        expect(
            cleanedHtml.includes('</style>') ||
            cleanedHtml.includes('</script>') ||
            cleanedHtml.includes('</link>') ||
            cleanedHtml.includes('<meta')
        ).toBe(false);
    });
})