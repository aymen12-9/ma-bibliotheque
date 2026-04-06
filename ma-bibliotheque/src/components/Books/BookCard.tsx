import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MoreVertical, Edit2, Trash2, Star } from 'lucide-react';
import type { Book } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { Rating } from '../Common/Rating';

interface BookCardProps {
  book: Book;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: Book['status']) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete, onStatusChange }) => {
  const { t } = useLanguage();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -6 }}
      className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-xl"
    >
      <div className="relative h-72 overflow-hidden bg-slate-100">
        <img
          src={book.coverUrl}
          alt={book.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent p-4">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-100">{book.publishYear || 'N/A'}</p>
        </div>

        <div className="absolute left-4 top-4 rounded-full border border-white bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
          {t(`status.${book.status}`)}
        </div>

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm transition hover:bg-slate-100"
        >
          <MoreVertical className="h-4 w-4" />
        </button>

        {showMenu && (
          <div className="absolute right-4 top-16 z-20 min-w-[10rem] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <button
              onClick={() => {
                onEdit?.();
                setShowMenu(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              <Edit2 className="h-4 w-4" />
              {t('book.edit')}
            </button>
            <button
              onClick={() => {
                onDelete?.();
                setShowMenu(false);
              }}
              className="flex w-full items-center gap-2 border-t border-slate-200 px-4 py-3 text-sm text-red-600 transition hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              {t('book.delete')}
            </button>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-950 mb-2 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-1">{book.authors.join(', ')}</p>
        <div className="mb-4 flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-400" />
          <Rating value={book.rating} readonly />
        </div>

        {onStatusChange ? (
          <select
            value={book.status}
            onChange={(e) => onStatusChange(e.target.value as Book['status'])}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            <option value="to-read">{t('status.to-read')}</option>
            <option value="reading">{t('status.reading')}</option>
            <option value="read">{t('status.read')}</option>
          </select>
        ) : (
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">{t(`status.${book.status}`)}</div>
        )}
      </div>
    </motion.div>
  );
};