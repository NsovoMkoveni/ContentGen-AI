document.addEventListener("DOMContentLoaded", function () {

    const themeButton = document.getElementById("themeButton");
    const generateButton = document.getElementById("generateButton");
    const topicInput = document.getElementById("topic");
    const contentType = document.getElementById("contentType");
    const tone = document.getElementById("tone");
    const audience = document.getElementById("audience");
    const length = document.getElementById("length");

    const result = document.getElementById("result");
    const wordCount = document.getElementById("wordCount");
    const statusMessage = document.getElementById("statusMessage");

    const copyButton = document.getElementById("copyButton");
    const downloadButton = document.getElementById("downloadButton");
    const saveButton = document.getElementById("saveButton");
    const clearButton = document.getElementById("clearButton");
    const regenerateButton = document.getElementById("regenerateButton");

    const historyList = document.getElementById("historyList");
    const clearHistoryButton = document.getElementById("clearHistoryButton");

    let currentContent = "";


    // =========================
    // DARK MODE
    // =========================

    function loadTheme() {
        const savedTheme = localStorage.getItem("contentGenTheme");

        if (savedTheme === "dark") {
            document.body.classList.add("dark");
            themeButton.textContent = "☀️";
        } else {
            document.body.classList.remove("dark");
            themeButton.textContent = "🌙";
        }
    }


    function toggleTheme() {
        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {
            localStorage.setItem("contentGenTheme", "dark");
            themeButton.textContent = "☀️";
        } else {
            localStorage.setItem("contentGenTheme", "light");
            themeButton.textContent = "🌙";
        }
    }


    // =========================
    // GENERATE CONTENT
    // =========================

    async function generateContent() {

        const topic = topicInput.value.trim();

        if (!topic) {
            statusMessage.textContent = "Please enter a topic first.";
            statusMessage.className = "status-message error";
            topicInput.focus();
            return;
        }

        statusMessage.textContent = "Generating content...";
        statusMessage.className = "status-message loading";

        generateButton.disabled = true;
        generateButton.textContent = "Generating...";

        try {

            const response = await fetch("/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    topic: topic,
                    content_type: contentType.value,
                    tone: tone.value,
                    audience: audience.value || "General audience",
                    length: length.value
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong.");
            }

            currentContent = data.content;

            result.textContent = currentContent;

            updateWordCount();

            statusMessage.textContent = "Content generated successfully!";
            statusMessage.className = "status-message success";

        } catch (error) {

            console.error("Generation error:", error);

            statusMessage.textContent =
                "Unable to generate content. Please try again.";

            statusMessage.className = "status-message error";

        } finally {

            generateButton.disabled = false;
            generateButton.innerHTML = "<span>✨</span> Generate Content";
        }
    }


    // =========================
    // WORD COUNT
    // =========================

    function updateWordCount() {

        if (!currentContent.trim()) {
            wordCount.textContent = "0 words";
            return;
        }

        const words = currentContent.trim().split(/\s+/).length;

        wordCount.textContent =
            words + (words === 1 ? " word" : " words");
    }


    // =========================
    // COPY
    // =========================

    async function copyContent() {

        if (!currentContent) {
            alert("There is no content to copy.");
            return;
        }

        try {

            await navigator.clipboard.writeText(currentContent);

            statusMessage.textContent = "Content copied!";
            statusMessage.className = "status-message success";

        } catch (error) {

            alert("Unable to copy content.");
        }
    }


    // =========================
    // DOWNLOAD
    // =========================

    function downloadContent() {

        if (!currentContent) {
            alert("There is no content to download.");
            return;
        }

        const blob = new Blob(
            [currentContent],
            { type: "text/plain" }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "contentgen-content.txt";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }


    // =========================
    // CLEAR RESULT
    // =========================

    function clearContent() {

        currentContent = "";

        result.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">✨</div>
                <h3>Your content will appear here</h3>
                <p>Enter your idea above and click Generate Content.</p>
            </div>
        `;

        wordCount.textContent = "0 words";

        statusMessage.textContent = "";
        statusMessage.className = "status-message";
    }


    // =========================
    // SAVE HISTORY
    // =========================

    function saveToHistory() {

        if (!currentContent) {
            alert("Generate some content before saving.");
            return;
        }

        const history =
            JSON.parse(localStorage.getItem("contentHistory") || "[]");

        const item = {
            id: Date.now(),
            topic: topicInput.value.trim(),
            type: contentType.value,
            content: currentContent,
            date: new Date().toLocaleString()
        };

        history.unshift(item);

        localStorage.setItem(
            "contentHistory",
            JSON.stringify(history)
        );

        displayHistory();

        statusMessage.textContent = "Content saved to history!";
        statusMessage.className = "status-message success";
    }


    // =========================
    // DISPLAY HISTORY
    // =========================

    function displayHistory() {

        const history =
            JSON.parse(localStorage.getItem("contentHistory") || "[]");

        historyList.innerHTML = "";

        if (history.length === 0) {

            historyList.innerHTML = `
                <div class="history-empty">
                    <p>No saved content yet.</p>
                </div>
            `;

            return;
        }

        history.forEach(function (item) {

            const card = document.createElement("div");

            card.className = "history-item";

            card.innerHTML = `
                <div class="history-info">
                    <h3>${escapeHtml(item.topic)}</h3>
                    <span>${escapeHtml(item.type)} · ${escapeHtml(item.date)}</span>
                </div>

                <div class="history-actions">
                    <button type="button" class="load-history">
                        Load
                    </button>

                    <button type="button" class="delete-history">
                        Delete
                    </button>
                </div>
            `;

            card.querySelector(".load-history")
                .addEventListener("click", function () {
                    currentContent = item.content;
                    result.textContent = currentContent;
                    updateWordCount();
                    window.scrollTo({
                        top: result.offsetTop - 100,
                        behavior: "smooth"
                    });
                });

            card.querySelector(".delete-history")
                .addEventListener("click", function () {

                    const updatedHistory =
                        history.filter(function (historyItem) {
                            return historyItem.id !== item.id;
                        });

                    localStorage.setItem(
                        "contentHistory",
                        JSON.stringify(updatedHistory)
                    );

                    displayHistory();
                });

            historyList.appendChild(card);
        });
    }


    // =========================
    // CLEAR HISTORY
    // =========================

    function clearHistory() {

        if (!confirm("Are you sure you want to clear your content history?")) {
            return;
        }

        localStorage.removeItem("contentHistory");

        displayHistory();
    }


    // =========================
    // REGENERATE
    // =========================

    function regenerateContent() {

        if (!topicInput.value.trim()) {
            alert("Please enter a topic first.");
            topicInput.focus();
            return;
        }

        generateContent();
    }


    // =========================
    // ESCAPE HTML
    // =========================

    function escapeHtml(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;
    }


    // =========================
    // BUTTON EVENTS
    // =========================

    themeButton.addEventListener("click", toggleTheme);

    generateButton.addEventListener("click", generateContent);

    copyButton.addEventListener("click", copyContent);

    downloadButton.addEventListener("click", downloadContent);

    saveButton.addEventListener("click", saveToHistory);

    clearButton.addEventListener("click", clearContent);

    regenerateButton.addEventListener("click", regenerateContent);

    clearHistoryButton.addEventListener("click", clearHistory);


    // =========================
    // CTRL + ENTER
    // =========================

    topicInput.addEventListener("keydown", function (event) {

        if (event.ctrlKey && event.key === "Enter") {
            generateContent();
        }
    });


    // =========================
    // START APP
    // =========================

    loadTheme();

    displayHistory();

});