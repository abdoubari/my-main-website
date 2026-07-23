let lastTemplate = -1;
let database;

const formState = {
    audience: "",
    goal: "",
    shape: "",
    message: ""
};

async function loadDatabase() {
    try {
        const response = await fetch("./database.json");
        database = await response.json();
    } catch (error) {
        console.error("Error loading database:", error);
    }
}

loadDatabase();

const filmStyles = [
    "Walking through a meaningful place.",
    "Sitting at your desk with reflective energy.",
    "Walking outside with voiceover.",
    "Talking directly to camera.",
    "Talking head with B-roll.",
    "Voiceover with walking shots.",
    "Direct-to-camera monologue.",
    "Screen recording with narration."
];

function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function replaceVariables(text) {
    if (!text) return "";
    return text
        .replaceAll("[audience]", formState.audience)
        .replaceAll("[message]", formState.message);
}

function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbxLSx_BhdZOAQh-WAc6btVqcPcn3ujLHOHy0q_3Cla8hT_ArVdN_grC-7LGc2khEMzh/exec";

function showNotification(message, type = "success") {
    const el = document.getElementById("notification");
    if (!el) return;
    el.textContent = message;
    el.className = `notification ${type}`;
    setTimeout(() => { el.className = "notification"; }, 2500);
}

function generate() {
    if (!database) {
        console.error("Database not loaded yet!");
        return;
    }

    const rawGoal = (formState.goal || "").toUpperCase().trim();
    const rawShape = (formState.shape || "").toLowerCase().trim();

    const goalMapping = {
        "CONTENT ATTRACT": "Attract",
        "CONTENT POSITIONING": "Positioning",
        "CONTENT NURTURE": "Nurture",
        "CONTENT CONVERSION": "Conversion",
        "ATTRACT": "Attract",
        "POSITIONING": "Positioning",
        "NURTURE": "Nurture",
        "CONVERSION": "Conversion"
    };

    const shapeMapping = {
        "tips & advice and mistakes": "Tips & advice and mistakes",
        "personal story": "Personal Story",
        "hot take , a contrarian or unpopular opinion": "Hot Take: رأي ضد السائد",
        "behind the scenes . process, real life, day-in-the-life": "Behind the scenes . Process, real life, day-in-the-life",
        "comparison then vs now, right vs wrong, x vs y": "Comparison Then vs now, right vs wrong, X vs Y"
    };

    const dbGoal = goalMapping[rawGoal] || formState.goal;
    const dbShape = shapeMapping[rawShape] || formState.shape;

    const category = database.categories.find(c => c.category === dbGoal);
    if (!category) {
        console.error("Category matching goal not found:", dbGoal);
        return;
    }

    const shapeData = category.shapes.find(s => s.shape === dbShape);
    if (!shapeData) {
        console.error("Shape data profile not found:", dbShape);
        return;
    }

    const templates = shapeData.items;

    let random;
    do {
        random = Math.floor(Math.random() * templates.length);
    } while (random === lastTemplate && templates.length > 1);

    lastTemplate = random;
    const template = templates[random];

    const concept = replaceVariables(template.concept);
    const textOnScreen = replaceVariables(template.text_on_screen);
    const sayOutLoud = replaceVariables(template.say_out_loud);
    const problem = replaceVariables(template.script_structure.problem);
    const pursuit = replaceVariables(template.script_structure.pursuit);
    const payoff = replaceVariables(template.script_structure.payoff);

    const randomFormat = template.film_overlay_format || pickRandom(filmStyles);

    if (GOOGLE_SHEET_WEBAPP_URL) {
        const formData = new URLSearchParams();
        formData.append("audience", formState.audience);
        formData.append("goal", dbGoal);
        formData.append("shape", dbShape);
        formData.append("message", formState.message);

        fetch(GOOGLE_SHEET_WEBAPP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString()
        }).catch(() => {});
    }

    document.getElementById("wizard-flow").style.display = "none";

    const resultContainer = document.getElementById("result");
    resultContainer.style.display = "block";

    const safeConcept = escapeHtml(concept);
    const safeTextOnScreen = escapeHtml(textOnScreen);
    const safeSayOutLoud = escapeHtml(sayOutLoud);
    const safeProblem = escapeHtml(problem);
    const safePursuit = escapeHtml(pursuit);
    const safePayoff = escapeHtml(payoff);
    const safeFormat = escapeHtml(randomFormat);

    resultContainer.innerHTML = `
        <div class="concept-main-title-block">
            <span class="concept-eyebrow">الفكرة الرئيسية والتجهيز</span>
            <h2>${safeConcept}</h2>
        </div>

        <div class="results-layout-grid">

            <div class="mockup-column">
                <div class="phone-frame">
                    <div class="phone-notch"></div>
                    <div class="phone-screen">
                        <div class="phone-progress-dots">
                            <span class="filled"></span><span></span><span></span>
                        </div>
                        <div class="phone-play-btn">▶</div>
                        <div class="phone-hook-wrapper">
                            <p class="phone-hook-text">${safeTextOnScreen}</p>
                        </div>
                        <div class="phone-bottom-meta">
                            <p class="phone-caption">${safeSayOutLoud}</p>
                        </div>
                    </div>
                </div>
                
                <div class="result-actions">
                    <button id="res-shuffle" class="action-icon-btn dark-pill">🔀 فكرة جديدة</button>
                    <button id="copy-reel-btn" class="action-icon-btn outline">📋 نسخ النص</button>
                    <button id="res-restart" class="action-icon-btn">🔄 إعادة</button>
                </div>
            </div>

            <div class="content-column" style="display: flex; flex-direction: column; gap: 14px;">

                <div class="result-card">
                    <div class="result-card-title">⚡ جذب الانتباه (The Hook)</div>
                    <div class="hook-row">
                        <label>نص الشاشة</label>
                        <p>"${safeTextOnScreen}"</p>
                    </div>
                    <div class="hook-row">
                        <label>الكلام المنطوق</label>
                        <p class="spoken">"${safeSayOutLoud}"</p>
                    </div>
                </div>

                <div class="result-card">
                    <div class="result-card-title">📋 هيكل السيناريو </div>
                    <div class="script-steps-stack">
                        <div class="script-step-row">
                            <span class="step-tag problem">01 المشكلة</span>
                            <div class="step-body-text">${safeProblem}</div>
                        </div>
                        <div class="script-step-row">
                            <span class="step-tag solution">02 الحل</span>
                            <div class="step-body-text">${safePursuit}</div>
                        </div>
                        <div class="script-step-row">
                            <span class="step-tag payoff">03 النتيجة</span>
                            <div class="step-body-text">${safePayoff}</div>
                        </div>
                    </div>
                </div>

                <div class="filming-tips">
                    <span class="eyebrow">أسلوب التصوير المقترح</span>
                    <p>🎬 ${safeFormat}</p>
                </div>

            </div>
        </div>
    `;

    document.getElementById("copy-reel-btn").addEventListener("click", function () {
        const reel = `CONCEPT\n${concept}\n\nHOOK\n${textOnScreen}\n\nSAY OUT LOUD\n${sayOutLoud}\n\nPROBLEM\n${problem}\n\nPURSUIT\n${pursuit}\n\nPAYOFF\n${payoff}`;
        navigator.clipboard.writeText(reel);
        this.innerText = "✓ تم النسخ";
        showNotification("تم نسخ النص بنجاح");
        setTimeout(() => { this.innerText = "📋 نسخ النص"; }, 1500);
    });

    document.getElementById("res-shuffle").addEventListener("click", generate);
    document.getElementById("res-restart").addEventListener("click", () => {
        window.location.reload();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let currentStep = 1;
    const totalSteps = 4;

    const steps = document.querySelectorAll(".step-section");
    const segments = document.querySelectorAll(".progress-segment");
    const stepCounter = document.getElementById("step-counter");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const generateBtn = document.getElementById("generate");
    const audienceInput = document.getElementById("audience");
    const messageInput = document.getElementById("message");

   document.getElementById("close-modal-btn").addEventListener("click", () => {
    const modal = document.getElementById("welcome-modal");
    if (modal) {
        modal.style.setProperty("display", "none", "important");
    }
});

    document.querySelectorAll(".example-tag").forEach(tag => {
        tag.addEventListener("click", function () {
            const cleanText = this.textContent.replace(/"/g, "");
            audienceInput.value = cleanText;
            formState.audience = cleanText;
            validateCurrentStep();
        });
    });

    document.querySelectorAll(".card-option").forEach(card => {
        card.addEventListener("click", function () {
            const parentSection = this.closest(".step-section").id;
            this.parentElement.querySelectorAll(".card-option").forEach(c => c.classList.remove("selected"));
            this.classList.add("selected");
            const selectionValue = this.getAttribute("data-value");

            if (parentSection === "step-2") formState.goal = selectionValue;
            if (parentSection === "step-3") formState.shape = selectionValue;
            validateCurrentStep();
        });
    });

    audienceInput.addEventListener("input", (e) => { formState.audience = e.target.value.trim(); validateCurrentStep(); });
    messageInput.addEventListener("input", (e) => { formState.message = e.target.value.trim(); validateCurrentStep(); });

    function validateCurrentStep() {
        let isValid = false;
        if (currentStep === 1 && formState.audience.length > 2) isValid = true;
        if (currentStep === 2 && formState.goal) isValid = true;
        if (currentStep === 3 && formState.shape) isValid = true;
        if (currentStep === 4 && formState.message.length > 5) isValid = true;

        if (isValid) {
            nextBtn.classList.remove("disabled"); nextBtn.classList.add("ready");
            generateBtn.classList.remove("disabled"); generateBtn.classList.add("ready");
        } else {
            nextBtn.classList.add("disabled"); nextBtn.classList.remove("ready");
            generateBtn.classList.add("disabled"); generateBtn.classList.remove("ready");
        }
    }

    function updateWizard() {
        steps.forEach((step, idx) => { step.classList.toggle("active", idx + 1 === currentStep); });
        segments.forEach((seg, idx) => { seg.classList.toggle("active", idx < currentStep); });
        stepCounter.innerHTML = `الخطوة <span class="num">${currentStep}</span> من ${totalSteps}`;
        prevBtn.style.display = currentStep > 1 ? "block" : "none";

        if (currentStep === totalSteps) {
            nextBtn.style.display = "none"; generateBtn.style.display = "block";
        } else {
            nextBtn.style.display = "block"; generateBtn.style.display = "none";
        }
        validateCurrentStep();
    }

    nextBtn.addEventListener("click", () => {
        if (currentStep < totalSteps && nextBtn.classList.contains("ready")) { currentStep++; updateWizard(); }
    });
    prevBtn.addEventListener("click", () => {
        if (currentStep > 1) { currentStep--; updateWizard(); }
    });

    generateBtn.addEventListener("click", () => {
        if (generateBtn.classList.contains("ready")) {
            generate();
        }
    });
    updateWizard();
});

// Theme Switcher Logic
const themeToggleBtn = document.getElementById("theme-toggle");

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-theme");
    });
}

function updateThemeByTime() {
    const hour = new Date().getHours();
    const isDaytime = hour >= 9 && hour < 18;
    
    if (isDaytime) {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme');
    }
}

updateThemeByTime();
