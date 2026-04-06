import type React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus } from 'lucide-react';
import { useBooks } from '../contexts/BookContext';
import { useLanguage } from '../contexts/LanguageContext';
import { BookCard } from '../components/Books/BookCard';
import { BookForm } from '../components/Books/BookForm';
import type { Book } from '../types';

export const Library: React.FC = () => {
  const { books, updateBook, deleteBook } = useBooks();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'read' | 'reading' | 'to-read'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const filteredBooks = books.filter(book => {
    if (filter === 'all') return true;
    return book.status === filter;
  });

  const stats = {
    total: books.length,
    read: books.filter(b => b.status === 'read').length,
    reading: books.filter(b => b.status === 'reading').length,
    toRead: books.filter(b => b.status === 'to-read').length
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      await deleteBook(id);
    }
  };

  const handleStatusChange = async (book: Book, newStatus: Book['status']) => {
    await updateBook(book.id, { status: newStatus });
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-primary-600">Bibliothèque</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950">{t('nav.library')}</h1>
              <p className="mt-3 text-base leading-7 text-slate-600">Organisez tous vos livres, gérez les statuts de lecture et trouvez rapidement ce que vous cherchez.</p>
            </div>
            <button
              onClick={() => {
                setEditingBook(null);
                setShowForm(true);
              }}
              className="inline-flex items-center gap-2 rounded-3xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-500/20 transition duration-300 hover:bg-primary-700"
            >
              <Plus className="h-5 w-5" />
              {t('book.add')}
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Total</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{stats.total}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t('status.read')}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{stats.read}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t('status.reading')}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{stats.reading}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t('status.to-read')}</p>
              <p className="mt-3 text-3xl font-semibold text-slate-950">{stats.toRead}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {['all', 'read', 'reading', 'to-read'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                  filter === status
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status === 'all' ? 'Tous' : t(`status.${status}`)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {filteredBooks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-12 text-center shadow-sm"
        >
          <BookOpen className="mx-auto mb-4 h-16 w-16 text-slate-400" />
          <h3 className="text-2xl font-semibold text-slate-900 mb-2">Aucun livre</h3>
          <p className="text-slate-600">Ajoutez votre premier livre en scannant un ISBN ou en recherchant un titre.</p>
        </motion.div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {filteredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={() => handleEdit(book)}
                onDelete={() => handleDelete(book.id)}
                onStatusChange={(status) => handleStatusChange(book, status)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <BookForm
            key={editingBook?.id ?? 'new'}
            book={editingBook}
            onClose={() => setShowForm(false)}
            onSave={() => {
              setShowForm(false);
              setEditingBook(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};