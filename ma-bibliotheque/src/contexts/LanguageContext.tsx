import React, { createContext, useContext, useState, useEffect } from 'react';

// Définir le type Language directement ici
type Language = 'fr' | 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  'app.title': {
    fr: 'Ma Bibliothèque',
    en: 'My Library',
    ar: 'مكتبتي'
  },
  'nav.dashboard': {
    fr: 'Tableau de bord',
    en: 'Dashboard',
    ar: 'لوحة التحكم'
  },
  'nav.library': {
    fr: 'Bibliothèque',
    en: 'Library',
    ar: 'المكتبة'
  },
  'nav.wishlist': {
    fr: 'Liste d\'envies',
    en: 'Wishlist',
    ar: 'قائمة الرغبات'
  },
  'nav.search': {
    fr: 'Rechercher',
    en: 'Search',
    ar: 'بحث'
  },
  'nav.scanner': {
    fr: 'Scanner ISBN',
    en: 'ISBN Scanner',
    ar: 'ماسح ISBN'
  },
  'status.read': {
    fr: 'Lu',
    en: 'Read',
    ar: 'مقروء'
  },
  'status.reading': {
    fr: 'En cours',
    en: 'Reading',
    ar: 'يقرأ'
  },
  'status.to-read': {
    fr: 'À lire',
    en: 'To Read',
    ar: 'للقراءة'
  },
  'book.add': {
    fr: 'Ajouter un livre',
    en: 'Add Book',
    ar: 'إضافة كتاب'
  },
  'book.delete': {
    fr: 'Supprimer',
    en: 'Delete',
    ar: 'حذف'
  },
  'book.edit': {
    fr: 'Modifier',
    en: 'Edit',
    ar: 'تعديل'
  },
  'book.rating': {
    fr: 'Note',
    en: 'Rating',
    ar: 'تقييم'
  },
  'book.comments': {
    fr: 'Commentaires',
    en: 'Comments',
    ar: 'تعليقات'
  },
  'book.quotes': {
    fr: 'Citations',
    en: 'Quotes',
    ar: 'اقتباسات'
  },
  'wishlist.priority': {
    fr: 'Priorité',
    en: 'Priority',
    ar: 'أولوية'
  },
  'wishlist.price': {
    fr: 'Prix',
    en: 'Price',
    ar: 'السعر'
  },
  'scan.instruction': {
    fr: 'Scannez le code-barres d\'un livre',
    en: 'Scan a book barcode',
    ar: 'امسح الباركود الخاص بالكتاب'
  },
  'search.placeholder': {
    fr: 'Rechercher par titre, auteur...',
    en: 'Search by title, author...',
    ar: 'ابحث بالعنوان، المؤلف...'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'fr';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};