const OPENAI_API_KEY = "your-openai-api-key"; // Replace with your actual key

chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === "analyzeText") {
        analyzeTextWithOpenAI(message.textData, sender.tab.id);
    }
});

async function analyzeTextWithOpenAI(textData, tabId) {
    let claimsToHighlight = [];

    for (let item of textData) {
        let response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are a misinformation detector. Given a paragraph, classify claims as either: 'false' (factually incorrect) or 'misleading' (manipulative but not outright false). Return the claim and classification." },
                    { role: "user", content: `Analyze this: "${item.text}"` }
                ]
            })
        });

        let data = await response.json();
        let aiResponse = data.choices[0].message.content;

        // Expecting AI to return structured JSON
        try {
            let result = JSON.parse(aiResponse);
            if (result.claims) {
                claimsToHighlight.push(...result.claims);
            }
        } catch (e) {
            console.error("Failed to parse OpenAI response", e);
        }
    }

    // Send detected misinformation back to content.js
    chrome.tabs.sendMessage(tabId, { action: "highlightMisinformation", claims: claimsToHighlight });
}
