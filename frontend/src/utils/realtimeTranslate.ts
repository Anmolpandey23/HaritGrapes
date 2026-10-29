// src/utils/realtimeTranslate.ts
import i18n from '../i18n';

export type SupportedLanguage = 'en' | 'hi' | 'mr';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी', flag: '🍇' },
];

/**
 * Patch DOM methods to protect React 18 from Google Translate modifying TextNodes.
 * Prevents "Failed to execute 'removeChild' on 'Node'" crashes.
 */
export function applyReactDomPatch() {
  if (typeof window === 'undefined' || typeof Node === 'undefined') return;

  if (typeof Node === 'function' && Node.prototype) {
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function <T extends Node>(child: T): T {
      if (child.parentNode !== this) {
        // Suppress Google Translate node detachment errors
        return child;
      }
      return originalRemoveChild.apply(this, [child]) as T;
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        // Suppress Google Translate node insertion mismatch
        return newNode;
      }
      return originalInsertBefore.apply(this, [newNode, referenceNode]) as T;
    };
  }
}

/**
 * Get current active language (Defaults to 'en')
 */
export function getCurrentLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('app_lang');
  if (saved === 'hi' || saved === 'mr' || saved === 'en') {
    return saved;
  }
  return 'en';
}

/**
 * Set Google Translate cookies
 */
function setGoogtransCookie(lang: SupportedLanguage) {
  const hostname = window.location.hostname;
  const cookieVal = lang === 'en' ? '/en/en' : `/en/${lang}`;

  // Set for current path
  document.cookie = `googtrans=${cookieVal}; path=/;`;
  // Set for current domain
  document.cookie = `googtrans=${cookieVal}; path=/; domain=${hostname};`;

  if (hostname.includes('.') && !hostname.startsWith('localhost')) {
    document.cookie = `googtrans=${cookieVal}; path=/; domain=.${hostname};`;
  }

  if (lang === 'en') {
    // Clear cookie when returning to default English
    document.cookie = `googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    document.cookie = `googtrans=; path=/; domain=${hostname}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  }
}

/**
 * Change the entire application's language in real-time.
 * Automatically translates every string on the page without manual mapping.
 */
export function setRealtimeLanguage(lang: SupportedLanguage) {
  const prevLang = getCurrentLanguage();
  localStorage.setItem('app_lang', lang);

  // Sync i18next
  if (i18n.isInitialized) {
    i18n.changeLanguage(lang);
  }

  // Update cookies for Google Translate
  setGoogtransCookie(lang);

  // Trigger Google Translate's combo selector if present in DOM
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    // If returning from non-English to English and widget is caching, reload to clean DOM
    if (prevLang !== 'en' && lang === 'en') {
      window.location.reload();
      return;
    }
  }

  // Broadcast event for custom components
  window.dispatchEvent(new CustomEvent('app_language_changed', { detail: { lang } }));
}

/**
 * Initialize the Google Translate script dynamically if not present.
 */
export function initRealtimeTranslate() {
  applyReactDomPatch();

  if (typeof window === 'undefined') return;

  // Add hidden translate container if missing
  let container = document.getElementById('google_translate_element');
  if (!container) {
    container = document.createElement('div');
    container.id = 'google_translate_element';
    container.style.display = 'none';
    document.body.appendChild(container);
  }

  // Define global init callback
  (window as any).googleTranslateElementInit = () => {
    const google = (window as any).google;
    if (google && google.translate) {
      new google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'en,hi,mr',
          autoDisplay: false,
        },
        'google_translate_element'
      );

      // Once initialized, if the user had a non-English language selected, apply it
      setTimeout(() => {
        const currentLang = getCurrentLanguage();
        if (currentLang !== 'en') {
          const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
          if (select && select.value !== currentLang) {
            select.value = currentLang;
            select.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }
      }, 500);
    }
  };

  // Inject Google Translate script if not already added
  if (!document.getElementById('google-translate-script')) {
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }
}
