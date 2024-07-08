
/**
 * Extracts links from a document based on a given domain.
 * 
 * @param {Object} param0 - The parameters for link extraction.
 * @param {string} param0.document - The document to extract links from.
 * @param {string} param0.domain - The domain to filter links by protocol + hostname eg. 'https://example.com'
 * @returns {Set<string>} - The set of extracted links.
 */
export function extractLinks({ document, domain }) {
    let protocol
    let hostname
    try {
        const url =  new URL(domain)
        protocol = url.protocol
        hostname = url.hostname
    } catch(err) {
        throw('Invalid domain format, has to be a valid for URL(domain)', domain)
    }
    const escapedDomain = domain.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const urlRegex = new RegExp(`((?<=href=")[(^\/)]?.*(?=["&]))|${escapedDomain}[a-zA-Z0-9\/-]*(?=[&'"])`, 'g');
    const links = new Set();
    let match;

    console.log('Starting link extraction...');

    while ((match = urlRegex.exec(document)) !== null) {
        links.add(match[0]);
    }

    links.forEach(link => {
        if (
            link.includes('.svg') || 
            link.includes('.css') || 
            link.includes('.js') || 
            link.includes('.ico') || 
            link.includes('.jpg') || 
            link.includes('.webp') ||
            link.includes('.woff') ||
            link.includes('.ttf') ||
            link.includes('\\') ||
            link.includes('tel:') ||
            link.includes('mailto:') ||
            link.includes('data:image') ||
            link.includes('javascript:') ||
            link.includes('\"')   // filter out "https://www.vodafone.com.au/contact/samsung-news\" target=\"_self",
        ) {
            console.log('Remove invalid link: %s \n', link);
            links.delete(link);
            return
        } 

        if (link.startsWith('/')) {
            console.log('Update relative link to absolute link:', link);
            links.delete(link);
            links.add(`${protocol}//${hostname}` + link);
        }

    });

    console.log('Link filtering completed.');

    return links;
}
