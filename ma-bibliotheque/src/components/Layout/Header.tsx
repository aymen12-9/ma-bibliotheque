import type { FC } from 'react';
import { Menu } from 'lucide-react';
import { LanguageSwitcher } from '../Common/LanguageSwitcher';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-2 text-slate-700 shadow-sm transition duration-300 hover:bg-slate-50 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Ma Bibliothèque" className="h-10 w-10 rounded-2xl bg-slate-100 p-2 shadow-sm" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">Ma Bibliothèque</p>
              <p className="text-base font-bold text-slate-900">Gestion de livres</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
};