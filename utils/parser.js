import TurndownService from 'turndown';

function stripHashAndQuery(link) {
    // Find the index of the first occurrence of '#' or '?'
    const hashIndex = link.indexOf('#');
    const queryIndex = link.indexOf('?');
    let minIndex = -1;

    if (hashIndex !== -1 && queryIndex !== -1) {
        // Both '#' and '?' found, take the minimum index
        minIndex = Math.min(hashIndex, queryIndex);
    } else if (hashIndex !== -1) {
        // Only '#' found
        minIndex = hashIndex;
    } else if (queryIndex !== -1) {
        // Only '?' found
        minIndex = queryIndex;
    }

    // If '#' or '?' found, strip off everything from there; otherwise, return the original link
    return minIndex !== -1 ? link.substring(0, minIndex) : link;
}


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
            if (
                match.includes('.svg') || 
                match.includes('.css') || 
                match.includes('.js') || 
                match.includes('.md') || 
                match.includes('.ico') || 
                match.includes('.zip') || 
                match.includes('.rar') || 
                match.includes('.jpg') || 
                match.includes('.png') || 
                match.includes('.pdf') || 
                match.includes('.txt') || 
                match.includes('.webp') ||
                match.includes('.woff') ||
                match.includes('.ttf') ||
                match.includes('\\') ||
                match.includes('tel:') ||
                match.includes('mailto:') ||
                match.includes('data:image') ||
                match.includes('javascript:') ||
                match.includes('\"') ||   // filter out "https://www.vodafone.com.au/contact/samsung-news\" target=\"_self",
                !isSameOrigin({ url: match, origin: validatedOrigin.origin })
            ) {
                return
            } 
    
            if (match.startsWith('//')) {
                return;
            }
    
            if (match.startsWith('/')) {
                links.add(stripHashAndQuery(validatedOrigin.origin + match));
                return
            }
    
            if (match.includes('#') || match.includes('?')) {
                links.add(stripHashAndQuery(match));
                return
            }

            links.add(formatUrl(match));
        });
    }
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
    // match between <link>, <script>, <style>, <img>, <head>
    const nonContentTagEXp = new RegExp(`(<[hls][ceit][anry][dikl][ep]?[t]?.*?(?:<\/[hls][ceit][anry][dikl][ep]?[t]?>))|(<img.*?(?:\/>))`, 'gms');
    return document.replace(nonContentTagEXp, '');
}