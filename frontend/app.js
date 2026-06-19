/**
 * ====================================
 *  MEME ENGINE & APPLICATION LOGIC
 * ====================================
 */

let papersState = [];
let lastFormData = null;

document.addEventListener("DOMContentLoaded", () => {
    try {
        if (typeof CONTENT === "undefined") {
            throw new Error("CONTENT is not defined. Ensure config/content.js is loaded first.");
        }
        initMemeEngine();
        populateYears();
        setupEventListeners();
    } catch (e) {
        console.error("Critical Failure:", e);
        alert("Failed to load application: " + e.message);
    }
});

// --- Meme Engine Controllers ---

function initMemeEngine() {
    loadBackgroundReel();
    startMemeBanner();
    calculatePanicLevel();
    // Render default paper media under panic widget
    renderPaperMedia();
    // Watch for changes to examDate in the config and reload when it changes
    watchExamDate();
}

// Render the global paper media area under the panic meter.
// If `label` is provided and an override exists, that media is used.
function renderPaperMedia(label) {
    const container = document.getElementById('paperMediaDisplay');
    if (!container) return;
    if (!window.CONTENT || !CONTENT.paperMedia) {
        container.innerHTML = '';
        container.classList.add('hidden');
        return;
    }

    const pm = CONTENT.paperMedia;
    const overrides = pm.overrides || {};
    let entry = null;
    if (label && overrides[label]) entry = overrides[label];
    if (!entry) entry = pm.default || null;

    if (!entry || !entry.url) {
        container.innerHTML = '';
        container.classList.add('hidden');
        return;
    }

    const rawUrl = entry.url;
    const type = (entry.type || '').toLowerCase();
    console.log('renderPaperMedia ->', { label, type, rawUrl });

    // Normalize to absolute path for local assets so the browser requests from web root
    let src = rawUrl;
    if (!/^https?:\/\//i.test(rawUrl) && !rawUrl.startsWith('/')) {
        src = '/' + rawUrl;
    }

    container.innerHTML = '';
    container.classList.remove('hidden');
    container.classList.add('debug-visible');

    if (type === 'video') {
        const v = document.createElement('video');
        v.controls = true;
        v.loop = true;
        v.muted = true;
        v.playsInline = true;
        v.src = src;
        v.style.display = 'block';
        v.addEventListener('error', (e) => console.error('paper media video load error', e, src));
        container.appendChild(v);
    } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = 'paper media';
        img.style.display = 'block';
        img.addEventListener('load', () => console.log('paper media loaded', src));
        img.addEventListener('error', (e) => console.error('paper media image load error', e, src));
        container.appendChild(img);
    }
}

function loadBackgroundReel() {
    const videoEl = document.getElementById("bgReel");
    const enabledReels = CONTENT.reels.filter(r => r.enabled);
    if (enabledReels.length > 0) {
        const randomReel = enabledReels[Math.floor(Math.random() * enabledReels.length)];
        videoEl.src = randomReel.url;
    }
}

function startMemeBanner() {
    const trackEl = document.getElementById("memeBannerTrack");
    const content1 = document.getElementById("memeBanner1");
    const content2 = document.getElementById("memeBanner2");

    if (CONTENT.banners && CONTENT.banners.length > 0) {
        const fullText = CONTENT.banners.join(" &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; ") + " &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; ";
        content1.innerHTML = fullText;
        content2.innerHTML = fullText;
    }
    
    // Apply speed control variable
    if (CONTENT.bannerSpeed) {
        // Convert speed (e.g. 12) to duration (25s) so higher numbers are faster
        const duration = 300 / CONTENT.bannerSpeed;
        trackEl.style.animation = `scroll-marquee ${duration}s linear infinite`;
    }
}

function calculatePanicLevel() {
    const today = new Date();
    const examDate = new Date(CONTENT.examDate);
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let stateKey = "relaxed";
    let messageCategory = "earlyBird";

    // Treat past dates as relaxed/earlyBird; today is exam day
        // New thresholds:
        // - past dates or >30 days => relaxed (green)
        // - 7+ days up to 30 => yellow (warning)
        // - 4..6 days => yellow (warning)
        // - exactly 3 days => orange (panic)
        // - 2,1,0 => critical (red)
        if (diffDays < 0 || diffDays > 30) {
            stateKey = "relaxed";
            messageCategory = "earlyBird";
        } else if (diffDays <= 2) {
            stateKey = "critical";
            messageCategory = "examDay";
        } else if (diffDays === 3) {
            stateKey = "panic"; // orange
            messageCategory = "oneWeek"; // reuse a short-warning message set
        } else if (diffDays <= 30) {
            // Covers 4..30 (7-day and 30-day yellow ranges)
            stateKey = "warning";
            messageCategory = "oneMonth";
        }

    // Update UI
    const panicData = CONTENT.panicLevels[stateKey];
    const messages = CONTENT.examMessages[messageCategory];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    const widget = document.getElementById("panicMeter");
    widget.style.borderTopColor = panicData.color;
    
    document.getElementById("panicLabel").textContent = panicData.label;
    document.getElementById("panicLabel").style.color = panicData.color;
    document.getElementById("panicMessage").textContent = `"${randomMsg}"`;
    
    renderPanicMedia(stateKey);
}

function checkSubjectMeme(e) {
    const code = e.target.value.trim();
    const box = document.getElementById("subjectMemeBox");
    
    if (CONTENT.subjectMemes[code]) {
        const memes = CONTENT.subjectMemes[code];
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
        box.textContent = randomMeme;
        box.classList.remove("hidden");
    } else {
        box.classList.add("hidden");
    }
}

function renderPanicMedia(stateKey) {
    const container = document.getElementById("panicMediaContainer");
    if (!container) return;

    const panicData = CONTENT.panicLevels[stateKey];
    if (!panicData || !panicData.media) {
        container.innerHTML = '<div class="panic-media-fallback">Meme unavailable. Study instead.</div>';
        container.classList.remove("hidden");
        return;
    }

    const mediaPath = panicData.media;
    const ext = mediaPath.split('.').pop().toLowerCase();
    const videoExts = ['mp4', 'webm'];
    const imageExts = ['gif', 'jpg', 'jpeg', 'png', 'webp'];

    container.innerHTML = '';
    container.classList.remove("hidden");

    if (videoExts.includes(ext)) {
        const v = document.createElement("video");
        v.controls = true;
        v.autoplay = true;
        v.muted = true;
        v.loop = true;
        v.playsInline = true;
        v.src = mediaPath;
        v.addEventListener('error', () => {
            container.innerHTML = '<div class="panic-media-fallback">Meme unavailable. Study instead.</div>';
        });
        container.appendChild(v);
    } else if (imageExts.includes(ext)) {
        const img = document.createElement("img");
        img.src = mediaPath;
        img.alt = `Panic Level Meme: ${stateKey}`;
        img.addEventListener('error', () => {
            container.innerHTML = '<div class="panic-media-fallback">Meme unavailable. Study instead.</div>';
        });
        container.appendChild(img);
    } else {
        container.innerHTML = '<div class="panic-media-fallback">Meme unavailable. Study instead.</div>';
    }
}

// --- Application Core UI & Logic ---

function populateYears() {
    const currentYear = new Date().getFullYear();
    const startSelect = document.getElementById("startYear");
    const endSelect = document.getElementById("endYear");
    
    for (let year = currentYear; year >= 2014; year--) {
        startSelect.add(new Option(year, year));
        endSelect.add(new Option(year, year));
    }
    
    startSelect.value = currentYear - 2;
    endSelect.value = currentYear;
}

function setupEventListeners() {
    document.getElementById("pyqForm").addEventListener("submit", handleFormSubmit);
    document.getElementById("downloadBtn").addEventListener("click", handleDownloadZip);
    document.getElementById("subjectCode").addEventListener("keyup", checkSubjectMeme);

    const toggleBtns = document.querySelectorAll(".toggle-btn");
    toggleBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            toggleBtns.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            document.getElementById("sessionMode").value = e.target.dataset.value;
        });
    });
}

function makeLabel(url) {
    const match = url.match(/\/(S|W)(\d{4})\//);
    if (match) {
        return `${match[1] === "S" ? "Summer" : "Winter"} ${match[2]}`;
    }
    return url;
}

function makeFilename(url, course, subjectCode) {
    const match = url.match(/\/(S|W)(\d{4})\//);
    if (match) {
        return `${subjectCode}_${course}_${match[1] === "S" ? "Summer" : "Winter"}${match[2]}.pdf`;
    }
    return "paper.pdf";
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const errorEl = document.getElementById("yearError");
    errorEl.textContent = "";
    errorEl.classList.add("hidden");
    
    document.getElementById("resultsSection").classList.add("hidden");
    document.getElementById("downloadMemeBox").classList.add("hidden");
    
    const btn = document.getElementById("submitBtn");
    btn.disabled = true;
    btn.textContent = "Searching Archives...";
    
    const subjectCode = document.getElementById("subjectCode").value.trim();
    const course = document.getElementById("course").value;
    const startYear = parseInt(document.getElementById("startYear").value);
    const endYear = parseInt(document.getElementById("endYear").value);
    const sessionMode = document.getElementById("sessionMode").value;
    
    if (startYear > endYear) {
        errorEl.textContent = "Start year cannot be after end year bro.";
        errorEl.classList.remove("hidden");
        resetSubmitButton();
        return;
    }
    
    const sessions = sessionMode === "SW" ? ["S", "W"] : [sessionMode];
    lastFormData = { subjectCode, course, startYear, endYear, sessions };
    
    try {
        const response = await fetch("/api/pyq/check", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lastFormData)
        });
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error);
        
        papersState = data.availableUrls.map(url => ({
            url,
            label: makeLabel(url),
            filename: makeFilename(url, course, subjectCode),
            status: "pending"
        }));
        
        renderPapersList();
        
    } catch (err) {
        errorEl.textContent = `Server Error: ${err.message}`;
        errorEl.classList.remove("hidden");
    } finally {
        resetSubmitButton();
    }
}

function resetSubmitButton() {
    const btn = document.getElementById("submitBtn");
    btn.disabled = false;
    btn.textContent = "Find Papers";
}

function renderPapersList() {
    const listEl = document.getElementById("paperList");
    const sectionEl = document.getElementById("resultsSection");
    
    document.getElementById("resultSummary").textContent = `Papers Found: ${papersState.length}`;
    document.getElementById("corsWarning").classList.add("hidden");
    document.getElementById("downloadRow").classList.remove("hidden");
    
    listEl.innerHTML = "";
    
    papersState.forEach(paper => {
        const li = document.createElement("li");
        li.className = "paper-item";
        
        let icon = "📄";
        if (paper.status === "downloading") icon = "⏳";
        if (paper.status === "done") icon = "✅";
        if (paper.status === "failed") icon = "❌";
        
        li.innerHTML = `
            <div style="display:flex;align-items:center;gap:0.5rem;">
                <span class="status-icon">${icon}</span>
                <span class="paper-label">${paper.label}</span>
            </div>
            <a href="${paper.url}" target="_blank" class="paper-link">View Original</a>
        `;
        listEl.appendChild(li);
    });
    
    // Show media for the first paper if available, otherwise default
    if (papersState.length > 0) {
        renderPaperMedia(papersState[0].label);
    } else {
        renderPaperMedia();
    }

    sectionEl.classList.remove("hidden");
}

async function handleDownloadZip() {
    if (!papersState.length || !lastFormData) return;
    
    const btn = document.getElementById("downloadBtn");
    btn.disabled = true;
    btn.textContent = "Downloading & Zipping...";
    
    const zip = new JSZip();
    let successCount = 0;
    let corsError = false;
    
    for (let i = 0; i < papersState.length; i++) {
        const paper = papersState[i];
        paper.status = "downloading";
        renderPapersList();
        
        try {
            const response = await fetch(paper.url);
            if (response.ok) {
                const blob = await response.blob();
                zip.file(paper.filename, blob);
                paper.status = "done";
                successCount++;
            } else {
                paper.status = "failed";
            }
        } catch (err) {
            if (err instanceof TypeError) corsError = true;
            paper.status = "failed";
        }
    }
    
    renderPapersList();
    
    if (successCount > 0) {
        const content = await zip.generateAsync({ type: "blob" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(content);
        a.download = `${lastFormData.subjectCode}_${lastFormData.course}_PYQ.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
        
        // Show random meme success message
        const memeBox = document.getElementById("downloadMemeBox");
        const randomMsg = CONTENT.downloadMessages[Math.floor(Math.random() * CONTENT.downloadMessages.length)];
        memeBox.textContent = `✨ ${randomMsg}`;
        memeBox.classList.remove("hidden");
    } else if (corsError) {
        document.getElementById("corsWarning").classList.remove("hidden");
        document.getElementById("downloadRow").classList.add("hidden");
    }
    
    btn.textContent = "Download Again";
    btn.disabled = false;
}

// Periodically fetch the config file (cache-busted) and reload page when examDate changes
function watchExamDate() {
    try {
        let lastExamDate = CONTENT.examDate;
        const url = '/config/content.js';
        setInterval(async () => {
            try {
                const res = await fetch(`${url}?_=${Date.now()}`, { cache: 'no-store' });
                if (!res.ok) return;
                const text = await res.text();
                const m = text.match(/examDate\s*:\s*["']([^"']+)["']/);
                if (m && m[1] !== lastExamDate) {
                    // New date detected — reload to load updated CONTENT
                    console.info('examDate changed from', lastExamDate, 'to', m[1], '- reloading');
                    location.reload();
                }
            } catch (e) {
                console.warn('watchExamDate fetch failed', e);
            }
        }, 5000);
    } catch (err) {
        console.warn('watchExamDate init failed', err);
    }
}

// ----------------------------------------------------------------------------
// HAMSTER EASTER EGG LOGIC
// ----------------------------------------------------------------------------
function initHamsterEasterEgg() {
    const hamsterContainer = document.querySelector('.hamster-easter-egg');
    const thoughtBubble = document.querySelector('.hamster-thought-bubble');

    // Add your audio file path here (e.g., "/assets/memes/squeak.mp3")
    // If you leave it empty (""), only the text bubble will show.
    const audioPath = "/assets/memes/fah.mp3"; 

    if (!hamsterContainer || !thoughtBubble) return;

    let audioObj = null;
    if (audioPath) {
        audioObj = new Audio(audioPath);
    }

    function toggleBubble(e) {
        if (e) e.preventDefault();
        
        const isOpening = !thoughtBubble.classList.contains('active');
        thoughtBubble.classList.toggle('active');

        // Play audio only when opening the bubble, if path is provided
        if (isOpening && audioObj) {
            audioObj.currentTime = 0; // Rewind to start
            audioObj.play().catch(err => console.log('Audio play prevented by browser', err));
        }
    }

    // Handle mouse click
    hamsterContainer.addEventListener('click', toggleBubble);

    // Handle keyboard interaction (Enter or Space)
    hamsterContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            toggleBubble(e);
        }
    });
}

// Initialize easter egg
initHamsterEasterEgg();


