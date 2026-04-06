import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  BookOpen, 
  Heart, 
  Search, 
  Camera, 
  Library,
  X
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { t } = useLanguage();

  const navItems = [
    { path: '/', icon: Home, label: t('nav.dashboard') },
    { path: '/library', icon: BookOpen, label: t('nav.library') },
    { path: '/wishlist', icon: Heart, label: t('nav.wishlist') },
    { path: '/search', icon: Search, label: t('nav.search') },
    { path: '/scanner', icon: Camera, label: t('nav.scanner') },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
          
          <motion.aside 
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-primary-900 to-primary-800 text-white shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-primary-700 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Library className="w-8 h-8" />
                  <h1 className="text-xl font-bold">{t('app.title')}</h1>
                </div>
                <button
                  onClick={onToggle}
                  className="p-1 rounded-lg hover:bg-primary-700 transition-colors lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) onToggle();
                    }}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2 ${
                        isActive
                          ? 'bg-primary-700 text-white shadow-lg'
                          : 'text-primary-100 hover:bg-primary-800 hover:text-white'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 border-t border-primary-700">
                <div className="text-xs text-primary-300 text-center">
                  © 2026 Ma Bibliothèque
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};