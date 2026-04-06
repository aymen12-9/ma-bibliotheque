import type React from 'react';
import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder }) => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || t('search.placeholder')}
        className="w-full rounded-3xl border border-slate-300 bg-white px-5 py-4 pl-14 text-sm text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
        aria-label="Recherche de livre"
      />
      <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
          aria-label="Effacer la recherche"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </form>
  );
};