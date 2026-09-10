import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import es from './locales/es.json';

function detectLocale() {
    const saved = localStorage.getItem('ps-locale');
    if (saved) return saved;
    return 'en';
}

export const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: detectLocale(),
    fallbackLocale: 'en',
    messages: { en, es }
});

document.documentElement.setAttribute('lang', i18n.global.locale.value);

export function setLocale(locale) {
    i18n.global.locale.value = locale;
    localStorage.setItem('ps-locale', locale);
    document.documentElement.setAttribute('lang', locale);
}
