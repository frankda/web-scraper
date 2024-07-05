export function extractLinks({ document, domain }) {
    const escapedDomain = domain.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const urlRegex = new RegExp(`((?<=href=")[(^\/)]?.*(?=["&]))|https:\\/\\/${escapedDomain}[a-zA-Z0-9\.\/-]*(?=[&'"\s])`, 'g');
    console.log(urlRegex)
    const links = new Set();
    let match;

    while ((match = urlRegex.exec(document)) !== null) {
        console.log(match)
        links.add(match[0]);
    }

    console.log(links)
    
    // loop through links and remove stirng that contains '.svg'
    links.forEach(link => {
        if (link.startsWith('/')) {
            links.delete(link);
            links.add(`https://${domain}` + link);
        }

        if (link.includes('.svg') || link.includes('.css') || link.includes('.js')) {
            links.delete(link);
        } 
    });

    return links;
}

const mockHtml = `#34;src&#34;: &#34;https://www.vodafone.com.au/images/icons/bundles-red.svg&#34;,
    34;: &#34;https://www.vodafone.com.au/mobile/bundle-and-save&#34;,
    &#34;href&#34;: &#34;https://www.vodafone.com.au/support/home-internet/nbn-troubleshooting&#34;,
              &#34;label&#34;: &#34;nbn troubleshooting&#34;,href="https://www.vodafone.com.au/contact/samsung-news"
`


// console.log(extractLinks({ document: mockHtml, domain: 'example.com'}))
extractLinks({ document: mockHtml, domain: 'www.vodafone.com.au'})
