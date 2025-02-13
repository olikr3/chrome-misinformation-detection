chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "highlightMisinformation") {
        let resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "<h3>Detected Misinformation:</h3>";

        message.claims.forEach(claim => {
            let claimEl = document.createElement("p");
            claimEl.innerHTML = `<strong>${claim.text}</strong> - <span style="color:${claim.type === 'false' ? 'orange' : 'yellow'}">${claim.type.toUpperCase()}</span>`;
            resultsDiv.appendChild(claimEl);
        });
    }
});