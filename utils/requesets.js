export async function fetchHtmlData(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();
        
        // Do something with the HTML document
        return html;
    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error:', error);
    }
}