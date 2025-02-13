// Function to extract text content from the page
function extractText() {
    let paragraphs = document.querySelectorAll(p); // Select all <p> elements
    let textData = [];
    
    // Collect text from each paragraph
    paragraphs.forEach((p, index) => {
        textData.push({ id: index, text: p.innerText });
    });

    // Send the extracted text to the background script for analysis
    chrome.runtime.sendMessage({ action: analyzeText, textData: textData });
}

// Function to highlight misinformation on the page
function highlightMisinformation(claims) {
    let paragraphs = document.querySelectorAll(p);

    claims.forEach(claim => {
        paragraphs.forEach((p) => {
            if (p.innerText.includes(claim.text)) {
                let color = claim.type === false ? orange : yellow; // Set color based on misinformation type
                let span = document.createElement(span);
                span.style.backgroundColor = color;
                span.style.padding = 2px;
                span.style.borderRadius = 5px;
                span.style.color = black;
                span.innerText = claim.text;

                // Replace the misleading text with highlighted text
                p.innerHTML = p.innerHTML.replace(claim.text, span.outerHTML);
            }
        });
    });
}

// Listen for messages from background.js
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === highlightMisinformation) {
        highlightMisinformation(message.claims);
    }
});

// Run text extraction when the page loads
extractText();

