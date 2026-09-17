/**
 * Application Bootstrap Module.
 *
 * Initializes the frontend application when the DOM is ready.
 * Registers all component controllers and connects API services.
 *
 * Per Architecture (docs/02-Architecture.md, Section 26):
 * - app.js bootstraps the application.
 * - Initializes all components.
 *
 * Per Rules (docs/03-Rules.md, JS-001):
 * - No business logic inside HTML.
 * - Event listeners attached programmatically.
 */

"use strict";

function getApiBaseUrl() {
    if (typeof window !== "undefined" && window.VITE_API_URL) {
        return window.VITE_API_URL.endsWith("/api/v1") ? window.VITE_API_URL : `${window.VITE_API_URL}/api/v1`;
    }
    if (typeof window !== "undefined" && window.ENV && window.ENV.VITE_API_URL) {
        return window.ENV.VITE_API_URL.endsWith("/api/v1") ? window.ENV.VITE_API_URL : `${window.ENV.VITE_API_URL}/api/v1`;
    }
    const isLocal = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const defaultHost = isLocal ? "http://localhost:8000" : "https://regenarate.onrender.com";
    return `${defaultHost}/api/v1`;
}

const APP_CONFIG = {
    apiBaseUrl: getApiBaseUrl(),
    appName: "AI Code Review & Rewrite Agent",
    version: "1.0.0",
};

/**
 * Global Application State
 */
window.appState = {
    editor: {
        code: "",
        language: "python",
        reviewFocus: "general",
    },
    review: {
        data: null,
        isLoading: false,
    },
    rewrite: {
        data: null,
        isLoading: false,
    },
    theme: "dark",
};

function getStoredTheme() {
    try {
        const saved = localStorage.getItem("regenarate-theme");
        if (saved === "light" || saved === "dark") return saved;
    } catch (e) {
        // Ignore storage failures.
    }
    return "dark";
}

function applyTheme(theme) {
    const effectiveTheme = theme === "light" ? "light" : "dark";
    document.body.dataset.theme = effectiveTheme;
    window.appState.theme = effectiveTheme;

    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) {
        themeBtn.textContent = effectiveTheme === "dark" ? "Dark" : "Light";
        themeBtn.setAttribute("aria-label", effectiveTheme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }

    const hljsLink = document.getElementById("hljs-theme");
    if (hljsLink) {
        hljsLink.href = effectiveTheme === "dark"
            ? "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github-dark.min.css"
            : "https://cdn.jsdelivr.net/npm/highlight.js@11.9.0/styles/github.min.css";
    }

    if (window.monaco && window.monaco.editor) {
        window.monaco.editor.setTheme(effectiveTheme === "dark" ? "vs-dark" : "vs");
    }

    try {
        localStorage.setItem("regenarate-theme", effectiveTheme);
    } catch (e) {
        // Ignore storage failures.
    }
}

/**
 * Initializes all controllers when DOM is ready.
 */
async function initializeApp() {
    console.info(`[${APP_CONFIG.appName}] v${APP_CONFIG.version} — Initializing...`);

    const savedTheme = getStoredTheme();
    applyTheme(savedTheme);

    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
            applyTheme(nextTheme);
        });
    }

    // 1. Initialize Console Controller (Phase 11)
    const consoleController = new window.ConsoleController();
    consoleController.init();
    window.consoleController = consoleController;

    // 2. Initialize Editor Controller
    const editorController = new window.EditorController(consoleController);
    editorController.init();

    // 3. Initialize Review Controller
    const reviewController = new window.ReviewController(editorController);
    reviewController.init();

    // 4. Initialize Rewrite Controller
    const rewriteController = new window.RewriteController(editorController);
    rewriteController.init();

    // 5. Verify Backend Health asynchronously
    checkBackendHealth();

    console.info(`[${APP_CONFIG.appName}] Application initialized successfully.`);
}

/**
 * Verifies API server connectivity.
 */
async function checkBackendHealth() {
    const healthBadge = document.getElementById("api-status-badge");
    try {
        const response = await window.apiClient.checkHealth();
        if (response.success) {
            console.info("[Health Check] Backend is operational:", response.data);
            if (healthBadge) {
                healthBadge.className = "text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
                healthBadge.textContent = "API Online";
            }
        }
    } catch (error) {
        console.warn("[Health Check] Backend offline or unreachable.");
        if (healthBadge) {
            healthBadge.className = "text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20";
            healthBadge.textContent = "API Offline";
        }
    }
}

// Attach listener on DOMContentLoaded
document.addEventListener("DOMContentLoaded", initializeApp);
