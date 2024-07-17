export async function fetchHtmlData(url, timeout = 8000, maxRetries = 3) {
    console.log('===================');
    console.log('Fetching content from: ', url);
    console.log('===================');

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
            console.error(`Attempt ${attempt} failed:`, error);
            if (attempt === maxRetries || !error.message.includes('Request timed out')) {
                // If it's the last attempt or the error is not a timeout, throw the error
                throw error;
            }
            console.log(`Retrying... (${attempt}/${maxRetries})`);
        }
    }
}