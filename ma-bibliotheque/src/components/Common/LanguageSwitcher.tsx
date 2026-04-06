import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'fr', name: 'FR', label: 'Français' },
    { code: 'en', name: 'EN', label: 'English' },
    { code: 'ar', name: 'AR', label: 'العربية' }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {languages.find(l => l.code === language)?.name}
        </span>
      </button>
      
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
              language === lang.code ? 'bg-primary-50 text-primary-600 font-medium' : 'text-gray-700'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};