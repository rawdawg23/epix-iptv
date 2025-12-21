export const LANGUAGES = {
  "en": {
    "name": "English",
    "flag": "🇺🇸",
    "dir": "ltr"
  },
  "es": {
    "name": "Español",
    "flag": "🇪🇸",
    "dir": "ltr"
  }
} as const;

export type LanguageCode = keyof typeof LANGUAGES;

export const defaultLanguage: LanguageCode = 'en';

export function getLanguageFromURL(pathname: string): LanguageCode {
  const langMatch = pathname.match(/^\/([a-z]{2})\//);
  const lang = langMatch ? langMatch[1] : defaultLanguage;
  return (lang in LANGUAGES ? lang : defaultLanguage) as LanguageCode;
}

export function getLocalizedPath(path: string, lang: string): string {
  const cleanPath = path.replace(/^\/[a-z]{2}\//, '/');
  if (lang === defaultLanguage) return cleanPath;
  return `/${lang}${cleanPath}`;
}

export function getAllLanguageVariants(
  path: string,
  baseUrl: string,
  enabledLanguages: LanguageCode[] = Object.keys(LANGUAGES) as LanguageCode[]
): Record<string, string> {
  const variants: Record<string, string> = {};
  const cleanPath = path.replace(/^\/[a-z]{2}\//, '/');
  
  enabledLanguages.forEach(lang => {
    const localizedPath = lang === defaultLanguage ? cleanPath : `/${lang}${cleanPath}`;
    variants[lang] = `${baseUrl}${localizedPath}`;
  });
  
  return variants;
}

export function getLanguageInfo(lang: LanguageCode) {
  return LANGUAGES[lang] || LANGUAGES[defaultLanguage];
}

export function isRTL(lang: LanguageCode): boolean {
  return LANGUAGES[lang]?.dir === 'rtl';
}

// UI Translations for enabled languages only
export const UI_TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {"home":"Home","pricing":"Pricing","features":"Features","faq":"FAQ","blog":"Blog","contact":"Contact","about":"About","getStarted":"Get Started","subscribe":"Subscribe Now","learnMore":"Learn More","readMore":"Read More","viewAll":"View All","liveChannels":"Live Channels","moviesAndSeries":"Movies & Series","uptime":"Uptime","support":"Support","mostPopular":"Most Popular","perMonth":"/month","perYear":"/year"},
  es: {"home":"Inicio","pricing":"Precios","features":"Características","faq":"Preguntas Frecuentes","blog":"Blog","contact":"Contacto","about":"Nosotros","getStarted":"Comenzar","subscribe":"Suscribirse Ahora","learnMore":"Saber Más","readMore":"Leer Más","viewAll":"Ver Todo","liveChannels":"Canales en Vivo","moviesAndSeries":"Películas y Series","uptime":"Disponibilidad","support":"Soporte","mostPopular":"Más Popular","perMonth":"/mes","perYear":"/año"},
};

export function t(key: string, lang: LanguageCode = 'en'): string {
  return UI_TRANSLATIONS[lang]?.[key] || UI_TRANSLATIONS['en' as LanguageCode]?.[key] || key;
}
