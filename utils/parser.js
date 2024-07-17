import TurndownService from 'turndown';

// TODO: Unit test for isSameOrigin function
export function isSameOrigin({ url, origin}) {
    // skip relative url
    if (url.startsWith('/')) {
        return true;
    }

    return url.includes(new URL(origin).hostname);
}

export function formatUrl(url, origin) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

export function validateURL(origin) {
    try {
        const url = new URL(origin);

        if (url.pathname !== '/') {
            console.log('\nUpdate origin to root path like https://example.com, do not include pathName\n Your url is for analysis is: %s\n', origin);
            throw new Error('Pathname included in URL');
        }
        
        return url;
    } catch(err) {
        throw new Error('Invalid origin format, has to be a valid for URL(url), consist of schema + hostname: ' + origin);
    }
}

/**
 * Extracts links from a document based on a given domain.
 * 
 * @param {Object} param0 - The parameters for link extraction.
 * @param {string} param0.document - The document to extract links from.
 * @param {string} param0.origin - The domain to filter links by protocol + hostname eg. 'https://example.com'
 * @returns {Set<string>} - The set of extracted links.
 */
export function extractLinks({ document, origin }) {
    const validatedOrigin = validateURL(origin)

    const escapedDomain = origin.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const urlRegex = new RegExp(`((?<=href=")[(^\/)]?.*?(?=["&]))|${escapedDomain}[a-zA-Z0-9\.\/-]*(?=[&'"])`, 'g');
    const links = new Set([formatUrl(origin)]);
    
    const matches = document.match(urlRegex);
    if (matches) {
        matches.forEach(match => {
            links.add(formatUrl(match));
        });
    }
    links.forEach(link => {
        // TODO: use regex to filter out unwanted links
        if (
            link.includes('.svg') || 
            link.includes('.css') || 
            link.includes('.js') || 
            link.includes('.md') || 
            link.includes('.ico') || 
            link.includes('.zip') || 
            link.includes('.rar') || 
            link.includes('.jpg') || 
            link.includes('.png') || 
            link.includes('.pdf') || 
            link.includes('.txt') || 
            link.includes('.webp') ||
            link.includes('.woff') ||
            link.includes('.ttf') ||
            link.includes('\\') ||
            link.includes('tel:') ||
            link.includes('mailto:') ||
            link.includes('data:image') ||
            link.includes('javascript:') ||
            link.includes('\"') ||   // filter out "https://www.vodafone.com.au/contact/samsung-news\" target=\"_self",
            !isSameOrigin({ url: link, origin: validatedOrigin.origin })
        ) {
            links.delete(link);
            return
        } 

        if (link.startsWith('/')) {
            links.delete(link);
            links.add(validatedOrigin.origin + link);
        }
    });

    return links;
}

export function extractContent(document) {
    const turndownService = new TurndownService();
    const cleanedDocument = removeNonContentTags(document);
    const markdown = turndownService.turndown(cleanedDocument);

    return markdown;
}



// replace all matched part with empty string
export function removeNonContentTags(document) {
    // match between <link>, <meta>, <script>, <style>
    const nonContentTagEXp = new RegExp(`<[lms][ceit][nrty][aikl][ep]?[t]?.*?(?:<\/[lms][ceit][nrty][aikl][ep]?[t]?.*?>)`, 'gms');
    return document.replace(nonContentTagEXp, '');
}