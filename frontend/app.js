/**
 * Purpose: Central application logic handling form submission, API requests, and ZIP generation.
 * This is written in Vanilla JavaScript to maximize readability and fundamental learning.
 */

// --- Constants & State ---
let papersState = []; // Holds the current list of papers: { url, label, filename, status }
let lastFormData = null;

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
    populateYears();
    setupEventListeners();
});

/**
 * Purpose: Populates the Start Year and End Year dropdowns dynamically.
 * Input: None (uses current date).
 * Output: Modifies DOM to add <option> elements to year selects.
 * Example: Adds options from 2026 down to 2014.
 */
function populateYears() {
    const currentYear = new Date().getFullYear();
    const startSelect = document.getElementById("startYear");
    const endSelect = document.getElementById("endYear");
    
    for (let year = currentYear; year >= 2014; year--) {
        const option1 = new Option(year, year);
        const option2 = new Option(year, year);
        startSelect.add(option1);
        endSelect.add(option2);
    }
    
    // Set default ranges
    startSelect.value = currentYear - 2;
    endSelect.value = currentYear;
}

/**
 * Purpose: Attach all necessary event listeners to UI elements.
 * Input: None.
 * Output: Attaches click/submit handlers.
 */
function setupEventListeners() {
    // Form submission
    document.getElementById("pyqForm").addEventListener("submit", handleFormSubmit);
    
    // Download ZIP button
    document.getElementById("downloadBtn").addEventListener("click", handleDownloadZip);

    // Session Toggle Buttons (Summer/Winter/Both)
    const toggleBtns = document.querySelectorAll(".toggle-btn");
    toggleBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Remove active class from all
            toggleBtns.forEach(b => b.classList.remove("active"));
            // Add to clicked
            e.target.classList.add("active");
            // Update hidden input
            document.getElementById("sessionMode").value = e.target.dataset.value;
        });
    });
}

/**
 * Purpose: Converts a GTU URL into a human-readable label.
 * Input: url (String) - e.g. "https://gtu.ac.in/uploads/W2021/BE/3150703.pdf"
 * Output: label (String) - e.g. "Winter 2021"
 * Example: makeLabel(".../S2022/...") returns "Summer 2022"
 */
function makeLabel(url) {
    const match = url.match(/\/(S|W)(\d{4})\//);
    if (match) {
        return `${match[1] === "S" ? "Summer" : "Winter"} ${match[2]}`;
    }
    return url;
}

/**
 * Purpose: Converts a GTU URL into a clean filename for the ZIP archive.
 * Input: url (String), course (String), subjectCode (String)
 * Output: filename (String)
 * Example: makeFilename(".../W2021/...", "BE", "315") -> "315_BE_Winter2021.pdf"
 */
function makeFilename(url, course, subjectCode) {
    const match = url.match(/\/(S|W)(\d{4})\//);
    if (match) {
        return `${subjectCode}_${course}_${match[1] === "S" ? "Summer" : "Winter"}${match[2]}.pdf`;
    }
    return "paper.pdf";
}

/**
 * Purpose: Handles the main form submission, validates input, and fetches candidate URLs from backend.
 * Input: Event object from form submit.
 * Output: Fetches JSON and triggers UI render.
 */
async function handleFormSubmit(e) {
    e.preventDefault(); // Prevent page reload
    
    // Reset UI state
    document.getElementById("yearError").textContent = "";
    document.getElementById("resultsSection").classList.add("hidden");
    document.getElementById("submitBtn").disabled = true;
    document.getElementById("submitBtn").textContent = "Generating...";
    
    // Gather values
    const subjectCode = document.getElementById("subjectCode").value.trim();
    const course = document.getElementById("course").value;
    const startYear = parseInt(document.getElementById("startYear").value);
    const endYear = parseInt(document.getElementById("endYear").value);
    const sessionMode = document.getElementById("sessionMode").value;
    
    // Validation
    if (startYear > endYear) {
        document.getElementById("yearError").textContent = "Start year must be before end year.";
        resetSubmitButton();
        return;
    }
    
    const sessions = sessionMode === "SW" ? ["S", "W"] : [sessionMode];
    
    const payload = {
        subjectCode,
        course,
        startYear,
        endYear,
        sessions
    };
    
    try {
        // We use relative path "/api" because the Express backend serves this HTML file!
        const response = await fetch("/api/pyq/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || "Failed to generate links");
        }
        
        // Success: Map response to our frontend state format
        lastFormData = payload;
        papersState = data.availableUrls.map(url => ({
            url,
            label: makeLabel(url),
            filename: makeFilename(url, course, subjectCode),
            status: "pending" // pending | downloading | done | failed
        }));
        
        renderPapersList();
        
    } catch (err) {
        alert("Error: " + err.message);
    } finally {
        resetSubmitButton();
    }
}

function resetSubmitButton() {
    const btn = document.getElementById("submitBtn");
    btn.disabled = false;
    btn.textContent = "Get Paper Links";
}

/**
 * Purpose: Renders the papersState array into the DOM.
 * Input: None (reads from global papersState).
 * Output: Updates HTML of the #paperList ul element.
 */
function renderPapersList() {
    const listEl = document.getElementById("paperList");
    const sectionEl = document.getElementById("resultsSection");
    
    listEl.innerHTML = ""; // Clear existing
    
    document.getElementById("resultTitle").textContent = `${papersState.length} papers found`;
    document.getElementById("corsWarning").classList.add("hidden");
    
    papersState.forEach((paper, index) => {
        const li = document.createElement("li");
        li.className = "paper-item";
        
        // Status indicator text/emojis instead of complex SVG icons for simplicity
        let statusIcon = "📄";
        if (paper.status === "downloading") statusIcon = "⏳";
        if (paper.status === "done") statusIcon = "✅";
        if (paper.status === "failed") statusIcon = "❌";
        
        li.innerHTML = `
            <div>
                <span class="status-icon">${statusIcon}</span>
                <span>${paper.label}</span>
            </div>
            <a href="${paper.url}" target="_blank" class="paper-link">Open</a>
        `;
        listEl.appendChild(li);
    });
    
    sectionEl.classList.remove("hidden");
}

/**
 * Purpose: Iterates through papersState, fetches PDFs, and builds a ZIP file using JSZip.
 * Input: None (triggered by click).
 * Output: Triggers browser download of a .zip file.
 */
async function handleDownloadZip() {
    if (!papersState.length || !lastFormData) return;
    
    const btn = document.getElementById("downloadBtn");
    btn.disabled = true;
    btn.textContent = "Downloading...";
    
    const zip = new JSZip();
    let successCount = 0;
    let failCount = 0;
    let corsError = false;
    
    for (let i = 0; i < papersState.length; i++) {
        const paper = papersState[i];
        paper.status = "downloading";
        renderPapersList(); // Re-render to show spinner/hourglass
        
        try {
            const response = await fetch(paper.url);
            if (response.ok) {
                const blob = await response.blob();
                zip.file(paper.filename, blob);
                paper.status = "done";
                successCount++;
            } else {
                paper.status = "failed";
                failCount++;
            }
        } catch (err) {
            // Fetch throws TypeError on CORS blocks
            if (err instanceof TypeError) corsError = true;
            paper.status = "failed";
            failCount++;
        }
    }
    
    renderPapersList(); // Final render for statuses
    
    // Update legend
    const legend = document.getElementById("legend");
    const sText = document.getElementById("successCount");
    const fText = document.getElementById("failCount");
    
    legend.classList.remove("hidden");
    if (successCount > 0) {
        sText.textContent = `${successCount} downloaded`;
        sText.classList.remove("hidden");
    }
    if (failCount > 0) {
        fText.textContent = `${failCount} not on GTU`;
        fText.classList.remove("hidden");
    }
    
    if (successCount > 0) {
        // Generate and download zip
        const content = await zip.generateAsync({ type: "blob" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = `${lastFormData.subjectCode}_${lastFormData.course}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
    } else if (corsError) {
        document.getElementById("corsWarning").classList.remove("hidden");
    }
    
    btn.textContent = "Download Again";
    btn.disabled = false;
}
