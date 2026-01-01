// Internationalization (i18n) module for Luna Launcher website

const i18n = {
    currentLang: 'zh-CN',
    translations: {},
    languageNames: {
        'zh-CN': '简体中文',
        'en-US': 'English'
    },
    isInitialized: false,

    // Initialize i18n
    async init() {
        // Detect language from localStorage or browser
        const savedLang = localStorage.getItem('lang');
        if (savedLang && this.isLanguageSupported(savedLang)) {
            this.currentLang = savedLang;
        } else {
            // Auto-detect browser language
            const browserLang = navigator.language || navigator.userLanguage;
            this.currentLang = this.isLanguageSupported(browserLang) ? browserLang : 'zh-CN';
        }

        // Load translations
        await this.loadTranslations(this.currentLang);

        // Update page
        this.updatePage();
        this.updateLanguageButton();

        // Set up language button click handler
        this.setupLanguageButton();
    },

    // Check if language is supported
    isLanguageSupported(lang) {
        const supportedLangs = ['zh-CN', 'en-US'];
        return supportedLangs.includes(lang);
    },

    // Load translations for a specific language
    async loadTranslations(lang) {
        try {
            console.log('Fetching:', `locales/${lang}.json`); // Debug log
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load translations for ${lang}`);
            }
            this.translations = await response.json();
            console.log('Translations loaded:', this.translations); // Debug log
        } catch (error) {
            console.error('Error loading translations:', error);
            // Fallback to default language
            if (lang !== 'zh-CN') {
                await this.loadTranslations('zh-CN');
            }
        }
    },

    // Change language
    async changeLanguage(newLang) {
        console.log('changeLanguage called:', newLang, 'current:', this.currentLang); // Debug log
        if (newLang === this.currentLang) {
            console.log('Same language, skipping'); // Debug log
            return;
        }

        console.log('Loading translations for:', newLang); // Debug log

        // Change language content
        await this.loadTranslations(newLang);
        this.currentLang = newLang;
        localStorage.setItem('lang', newLang);
        this.updatePage();
        this.updateLanguageButton();

        console.log('Language changed to:', newLang); // Debug log
    },

    // Update page content
    updatePage() {
        console.log('updatePage called, currentLang:', this.currentLang); // Debug log

        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;

        // Update body data-lang attribute for CSS-based language switching
        document.body.setAttribute('data-lang', this.currentLang);

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && this.translations.meta) {
            metaDesc.content = this.translations.meta.description;
        }

        // Update page title if the title element has data-i18n attribute
        const titleElement = document.querySelector('title[data-i18n]');
        if (titleElement) {
            const key = titleElement.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(this.translations, key);
            if (translation) {
                document.title = translation;
            }
        }

        // Update all elements with data-i18n attribute with staggered animation
        const elements = Array.from(document.querySelectorAll('[data-i18n]'));
        console.log('Found', elements.length, 'elements to translate'); // Debug log

        // Sort elements by position (top to bottom, left to right)
        elements.sort((a, b) => {
            const aRect = a.getBoundingClientRect();
            const bRect = b.getBoundingClientRect();

            // First sort by top position
            if (Math.abs(aRect.top - bRect.top) > 10) {
                return aRect.top - bRect.top;
            }
            // If on same row, sort by left position
            return aRect.left - bRect.left;
        });

        // Each element fades out, changes text, then fades in independently
        elements.forEach((element, index) => {
            const delay = index * 30; // 30ms stagger between each element

            setTimeout(() => {
                // Fade out
                element.classList.add('changing');
            }, delay);

            setTimeout(() => {
                // Change text
                const key = element.getAttribute('data-i18n');
                const translation = this.getNestedTranslation(this.translations, key);
                if (translation) {
                    element.textContent = translation;
                } else {
                    console.warn('No translation found for key:', key); // Debug log
                }

                // Fade in
                element.classList.remove('changing');
                element.classList.add('changed');

                // Clean up after animation
                setTimeout(() => {
                    element.classList.remove('changed');
                }, 300);
            }, delay + 200); // Change text after 200ms fade out
        });

        // Handle elements with data-i18n-lang attribute (show/hide based on language)
        const langElements = document.querySelectorAll('[data-i18n-lang]');
        langElements.forEach(element => {
            const lang = element.getAttribute('data-i18n-lang');
            if (lang === this.currentLang) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });

        // Update all elements with data-i18n-html attribute (HTML content support)
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.getNestedTranslation(this.translations, key);
            if (translation) {
                element.innerHTML = translation;
            }
        });

        // Update all elements with data-i18n-placeholder attribute
        const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
        placeholderElements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getNestedTranslation(this.translations, key);
            if (translation) {
                element.placeholder = translation;
            }
        });

        // Update aria-labels
        const ariaElements = document.querySelectorAll('[data-i18n-aria]');
        ariaElements.forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            const translation = this.getNestedTranslation(this.translations, key);
            if (translation) {
                element.setAttribute('aria-label', translation);
            }
        });

        // Update alt text
        const altElements = document.querySelectorAll('[data-i18n-alt]');
        altElements.forEach(element => {
            const key = element.getAttribute('data-i18n-alt');
            const translation = this.getNestedTranslation(this.translations, key);
            if (translation) {
                element.alt = translation;
            }
        });
    },

    // Get nested translation using dot notation
    getNestedTranslation(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    },

    // Update language button
    updateLanguageButton() {
        const currentLangSpan = document.querySelector('.current-lang');
        if (currentLangSpan) {
            currentLangSpan.textContent = this.languageNames[this.currentLang] || this.currentLang;
        }
    },

    // Setup language button interactions
    setupLanguageButton() {
        // Prevent duplicate initialization
        if (this.isInitialized) return;
        this.isInitialized = true;

        const langButton = document.getElementById('language-button');
        const langMenu = document.getElementById('language-menu');
        const langOptions = document.querySelectorAll('.language-option');

        if (!langButton || !langMenu) return;

        // Toggle language menu
        langButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = langMenu.classList.contains('show');
            this.closeAllMenus();
            if (!isOpen) {
                langMenu.classList.add('show');
                langButton.classList.add('active');
            }
        });

        // Handle language option clicks
        langOptions.forEach(option => {
            option.addEventListener('click', async (e) => {
                e.stopPropagation();
                const newLang = option.getAttribute('data-lang');
                console.log('Changing language to:', newLang); // Debug log
                await this.changeLanguage(newLang);
                this.closeAllMenus();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', () => {
            this.closeAllMenus();
        });

        // Close menu on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllMenus();
            }
        });
    },

    // Close all language menus
    closeAllMenus() {
        const langMenu = document.getElementById('language-menu');
        const langButton = document.getElementById('language-button');
        if (langMenu) {
            langMenu.classList.remove('show');
        }
        if (langButton) {
            langButton.classList.remove('active');
        }
    }
};

// Initialize i18n when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}
