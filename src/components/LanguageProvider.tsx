import React, { createContext, useContext, useState } from 'react';

// Simple translation system
const translations = {
  en: {
    home: 'Home',
    create: 'Create', 
    profile: 'Profile',
    menu: 'Menu',
    resume_builder: 'Resume Builder',
    welcome: 'Welcome',
    sign_up: 'Sign Up',
    sign_in: 'Sign In',
    loading: 'Loading...',
    back: 'Back'
  },
  es: {
    home: 'Inicio',
    create: 'Crear',
    profile: 'Perfil', 
    menu: 'Menú',
    resume_builder: 'Creador de CV',
    welcome: 'Bienvenido',
    sign_up: 'Registrarse',
    sign_in: 'Iniciar Sesión',
    loading: 'Cargando...',
    back: 'Atrás'
  }
};

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState('en');

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
  };

  const t = (key: string) => {
    const currentTranslations = translations[language as keyof typeof translations] || translations.en;
    return currentTranslations[key as keyof typeof currentTranslations] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}