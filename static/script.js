// ==========================================
// CONTENT GENERATOR
// ==========================================

async function generateContent() {

    const topic =
        document.getElementById("topic").value.trim();

    const contentType =
        document.getElementById("contentType").value;

    const tone =
        document.getElementById("tone").value;

    const audience =
        document.getElementById("audience").value.trim() ||
        "General audience";

    const length =
        document.getElementById("length").value;

    const result =
        document.getElementById("result");


    // Check if the user entered a topic

    if (!topic) {

        alert("Please enter a topic first.");

        return;
    }


    // Show loading message

    result.innerHTML = `
        <div class="empty-state">

            <div class="icon">
                ⏳
            </div>

            <h3>
                Generating your content...
            </h3>

            <p>
                Please wait.
            </p>

        </div>
    `;


    try {

        // Send information to Flask backend

        const response = await fetch("/generate", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                topic: topic,

                content_type: contentType,

                tone: tone,

                audience: audience,

                length: length

            })

        });


        const data = await response.json();


        // Check for errors

        if (!response.ok) {

            throw new Error(
                data.error || "Something went wrong."
            );

        }


        // Display generated content

        result.textContent = data.content;


        // Update word count

        updateWordCount(data.content);

    }


    catch (error) {

        result.textContent =
            "Something went wrong: " +
            error.message;

    }

}



// ==========================================
// WORD COUNT
// ==========================================

function updateWordCount(text) {

    const words = text
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0);


    document.getElementById("wordCount").textContent =
        words.length + " words";

}



// ==========================================
// COPY CONTENT
// ==========================================

function copyContent() {

    const text =
        document.getElementById("result").innerText;


    if (!text.trim()) {

        alert("There is no content to copy.");

        return;
    }


    navigator.clipboard.writeText(text)

        .then(() => {

            alert("Content copied successfully!");

        })

        .catch(() => {

            alert("Unable to copy the content.");

        });

}



// ==========================================
// DOWNLOAD CONTENT
// ==========================================

function downloadContent() {

    const text =
        document.getElementById("result").innerText;


    if (!text.trim()) {

        alert("There is no content to download.");

        return;
    }


    const blob =
        new Blob([text], {

            type: "text/plain"

        });


    const url =
        URL.createObjectURL(blob);


    const link =
        document.createElement("a");


    link.href = url;

    link.download =
        "generated-content.txt";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);


    URL.revokeObjectURL(url);

}



// ==========================================
// CLEAR CURRENT CONTENT
// ==========================================

function clearContent() {

    document.getElementById("result").innerHTML = `

        <div class="empty-state">

            <div class="icon">
                ✍️
            </div>

            <h3>
                Your content will appear here
            </h3>

            <p>
                Enter a topic and click
                "Generate Content" to get started.
            </p>

        </div>

    `;


    document.getElementById("wordCount").textContent =
        "0 words";

}



// ==========================================
// SAVE CONTENT TO HISTORY
// ==========================================

function saveToHistory() {

    const content =
        document.getElementById("result").innerText.trim();


    // Make sure there is content

    if (!content) {

        alert("There is no content to save.");

        return;
    }


    // Get existing history

    let history =
        JSON.parse(
            localStorage.getItem("contentHistory")
        ) || [];


    // Create a new history item

    const historyItem = {

        id: Date.now(),

        content: content,

        date: new Date().toLocaleString()

    };


    // Add newest content to the beginning

    history.unshift(historyItem);


    // Save history in browser

    localStorage.setItem(
        "contentHistory",
        JSON.stringify(history)
    );


    // Update the history section

    displayHistory();


    alert("Content saved to history!");

}



// ==========================================
// DISPLAY HISTORY
// ==========================================

function displayHistory() {

    const historyList =
        document.getElementById("historyList");


    // Get saved history

    const history =
        JSON.parse(
            localStorage.getItem("contentHistory")
        ) || [];


    // If there is no history

    if (history.length === 0) {

        historyList.innerHTML = `

            <div class="history-empty">

                <div class="icon">
                    📝
                </div>

                <p>
                    Your saved content will appear here.
                </p>

            </div>

        `;

        return;
    }


    // Create history cards

    historyList.innerHTML = "";


    history.forEach(item => {

        const card =
            document.createElement("div");


        card.className =
            "history-card";


        card.innerHTML = `

            <div class="history-card-header">

                <span>
                    📄 Saved Content
                </span>

                <small>
                    ${item.date}
                </small>

            </div>


            <div class="history-content">

                ${escapeHtml(item.content)}

            </div>


            <div class="history-actions">

                <button
                    onclick="loadHistory(${item.id})"
                >
                    ↩️ Load
                </button>


                <button
                    onclick="deleteHistory(${item.id})"
                >
                    🗑️ Delete
                </button>

            </div>

        `;


        historyList.appendChild(card);

    });

}



// ==========================================
// LOAD SAVED CONTENT
// ==========================================

function loadHistory(id) {

    const history =
        JSON.parse(
            localStorage.getItem("contentHistory")
        ) || [];


    const item =
        history.find(
            historyItem => historyItem.id === id
        );


    if (!item) {

        alert("Saved content could not be found.");

        return;
    }


    // Put saved content into result box

    document.getElementById("result").textContent =
        item.content;


    // Update word count

    updateWordCount(item.content);


    // Scroll to result

    document.getElementById("result").scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

}



// ==========================================
// DELETE ONE HISTORY ITEM
// ==========================================

function deleteHistory(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this saved content?"
        );


    if (!confirmed) {

        return;
    }


    let history =
        JSON.parse(
            localStorage.getItem("contentHistory")
        ) || [];


    history =
        history.filter(
            item => item.id !== id
        );


    localStorage.setItem(
        "contentHistory",
        JSON.stringify(history)
    );


    displayHistory();

}



// ==========================================
// CLEAR ALL HISTORY
// ==========================================

function clearHistory() {

    const history =
        JSON.parse(
            localStorage.getItem("contentHistory")
        ) || [];


    if (history.length === 0) {

        alert("There is no history to clear.");

        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to clear all saved content?"
        );


    if (!confirmed) {

        return;
    }


    localStorage.removeItem(
        "contentHistory"
    );


    displayHistory();


    alert("History cleared.");

}



// ==========================================
// SECURITY HELPER
// ==========================================

function escapeHtml(text) {

    const div =
        document.createElement("div");


    div.textContent = text;


    return div.innerHTML;

}



// ==========================================
// DARK MODE
// ==========================================

function toggleTheme() {

    document.body.classList.toggle("dark");


    const button =
        document.getElementById("themeButton");


    if (
        document.body.classList.contains("dark")
    ) {

        button.textContent = "☀️";

    }

    else {

        button.textContent = "🌙";

    }

}



// ==========================================
// LOAD HISTORY WHEN PAGE OPENS
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayHistory();

    }
);