import React, { useState } from 'react';
import { Globe, FileText } from 'lucide-react';

interface HeaderProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

export function Header({ language, onLanguageChange }: HeaderProps) {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-teal-500 text-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Resume Builder</h1>
            <p className="text-xs text-teal-100">Professional Documents</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
            className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">{currentLanguage.flag}</span>
          </button>

          {showLanguageMenu && (
            <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[200px] z-10">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                    language === lang.code ? 'bg-teal-50 text-teal-600' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                  {language === lang.code && (
                    <div className="ml-auto w-2 h-2 bg-teal-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Close language menu when clicking outside */}
      {showLanguageMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowLanguageMenu(false)}
        />
      )}
    </header>
  );
}