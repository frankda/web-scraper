export async function fetchHtmlData(url, timeout = 8000) {
    console.log('===================');
    console.log('Fetching content from: ', url);
    console.log('===================');
    try {
        const responsePromise = fetch(url);
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Request timed out'));
            }, timeout);
        });

        const response = await Promise.race([responsePromise, timeoutPromise]);
        const html = await response.text();
        
        // Do something with the HTML document
        return html;
    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error:', error);
    }
}