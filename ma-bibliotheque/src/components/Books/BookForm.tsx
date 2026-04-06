import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save } from 'lucide-react';
import type { Book } from '../../types';
import { useBooks } from '../../contexts/BookContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Rating } from '../Common/Rating';

const createInitialFormData = (): Partial<Book> => ({
  title: '',
  authors: [''],
  isbn: '',
  coverUrl: '',
  description: '',
  pageCount: 0,
  publishYear: new Date().getFullYear(),
  publisher: '',
  language: 'fr',
  genres: [],
  status: 'to-read',
  rating: 0,
  comments: '',
  quotes: [],
  dateRead: '',
  addedDate: new Date().toISOString().split('T')[0]
});

interface BookFormProps {
  book?: Book | null;
  onClose: () => void;
  onSave: () => void;
}

export const BookForm: React.FC<BookFormProps> = ({ book, onClose, onSave }) => {
  const { addBook, updateBook } = useBooks();
  const { t } = useLanguage();

  const [formData, setFormData] = useState<Partial<Book>>(book || createInitialFormData());
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isSaveEnabled = Boolean(
    formData.title?.trim() &&
    formData.authors?.some((author) => author?.trim())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSaving(true);

    const bookData: Book = {
      id: book?.id || Date.now().toString(),
      isbn: formData.isbn || '',
      title: formData.title || 'Titre inconnu',
      authors: formData.authors || ['Auteur inconnu'],
      coverUrl: formData.coverUrl || 'https://placehold.co/400x600?text=No+Cover',
      description: formData.description || '',
      pageCount: formData.pageCount || 0,
      publishYear: formData.publishYear || new Date().getFullYear(),
      publisher: formData.publisher || '',
      language: formData.language || 'fr',
      genres: formData.genres || [],
      status: formData.status as Book['status'] || 'to-read',
      rating: formData.rating || 0,
      comments: formData.comments || '',
      quotes: formData.quotes || [],
      dateRead: formData.dateRead || '',
      addedDate: book?.addedDate || new Date().toISOString().split('T')[0]
    };

    try {
      if (book) {
        await updateBook(book.id, bookData);
      } else {
        await addBook(bookData);
      }
      onSave();
    } catch (error) {
      console.error('Book save failed:', error);
      setErrorMessage('Impossible d\'enregistrer le livre. Vérifiez que le serveur est démarré et réessayez.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {book ? 'Modifier le livre' : t('book.add')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Authors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Auteur(s) *
            </label>
            <input
              type="text"
              value={formData.authors?.join(', ')}
              onChange={(e) => setFormData({ ...formData, authors: e.target.value.split(',').map(a => a.trim()) })}
              required
              placeholder="Séparez les auteurs par des virgules"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* ISBN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ISBN
            </label>
            <input
              type="text"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Cover URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de la couverture
            </label>
            <input
              type="url"
              value={formData.coverUrl}
              onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Page Count and Year */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de pages
              </label>
              <input
                type="number"
                value={formData.pageCount}
                onChange={(e) => setFormData({ ...formData, pageCount: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année de publication
              </label>
              <input
                type="number"
                value={formData.publishYear}
                onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) || new Date().getFullYear() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Publisher and Language */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Éditeur
              </label>
              <input
                type="text"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Langue
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>

          {/* Status and Rating */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Book['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="to-read">{t('status.to-read')}</option>
                <option value="reading">{t('status.reading')}</option>
                <option value="read">{t('status.read')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('book.rating')}
              </label>
              <Rating
                value={formData.rating || 0}
                onChange={(value) => setFormData({ ...formData, rating: value })}
              />
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('book.comments')}
            </label>
            <textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Vos commentaires personnels..."
            />
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Form Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={!isSaveEnabled || saving}
              className={`flex-1 flex items-center justify-center space-x-2 px-6 py-2 rounded-lg transition-colors ${!isSaveEnabled || saving ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Enregistrement...' : 'Enregistrer'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};