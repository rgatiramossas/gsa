import React, { createContext, useState, useEffect, ReactNode } from "react";
import ptTranslations from "../locales/pt.json";
import deTranslations from "../locales/de.json";

type TranslationKeys = Record<string, any>;

type I18nContextType = {
  t: (key: string) => string;
  locale: string;
  setLocale: (locale: string) => void;
  locales: { value: string; label: string }[];
};

export const I18nContext = createContext<I18nContextType>({
  t: (key) => key,
  locale: "pt",
  setLocale: () => {},
  locales: [
    { value: "pt", label: "Português" },
    { value: "de", label: "Deutsch" },
  ],
});

type I18nProviderProps = {
  children: ReactNode;
};

// Cast the translations to the appropriate type
const translations: Record<string, any> = {
  pt: ptTranslations,
  de: deTranslations,
};

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [locale, setLocale] = useState("pt");
  
  // Load locale from localStorage if available
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale");
    if (savedLocale && (savedLocale === "pt" || savedLocale === "de")) {
      setLocale(savedLocale);
    }
  }, []);
  
  // Save locale to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("locale", locale);
  }, [locale]);
  
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[locale];
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return the key if translation is not found
      }
    }
    
    return typeof value === "string" ? value : key;
  };
  
  const value = {
    t,
    locale,
    setLocale,
    locales: [
      { value: "pt", label: "Português" },
      { value: "de", label: "Deutsch" },
    ],
  };
  
  return React.createElement(I18nContext.Provider, { value }, children);
};
