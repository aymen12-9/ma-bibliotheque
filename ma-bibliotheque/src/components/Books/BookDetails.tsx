import type React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, FileText, Heart, Quote, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import type { Book } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useBooks } from '../../contexts/BookContext';
import { Rating } from '../Common/Rating';

interface BookDetailsProps {
  book: Book;
  onClose: () => void;
  onEdit: () => void;
}

export const BookDetails: React.FC<BookDetailsProps> = ({ book, onClose, onEdit }) => {
  const { t } = useLanguage();
  const { updateBook, deleteBook } = useBooks();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newQuote, setNewQuote] = useState('');
  const [showAddQuote, setShowAddQuote] = useState(false);

  const handleStatusChange = async (status: Book['status']) => {
    await updateBook(book.id, { status });
  };

  const handleRatingChange = async (rating: number) => {
    await updateBook(book.id, { rating });
  };

  const handleAddQuote = async () => {
    if (newQuote.trim()) {
      const updatedQuotes = [...(book.quotes || []), newQuote.trim()];
      await updateBook(book.id, { quotes: updatedQuotes });
      setNewQuote('');
      setShowAddQuote(false);
    }
  };

  const handleDeleteQuote = async (index: number) => {
    const updatedQuotes = book.quotes.filter((_, i) => i !== index);
    await updateBook(book.id, { quotes: updatedQuotes });
  };

  const handleDeleteBook = async () => {
    await deleteBook(book.id);
    onClose();
  };

  const getStatusIcon = () => {
    switch (book.status) {
      case 'read':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'reading':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Cover Image */}
        <div className="relative h-80 md:h-96">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Action Buttons */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={onEdit}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            >
              <Edit2 className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>

          {/* Book Title Overlay */}
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{book.title}</h1>
            <p className="text-lg text-gray-200">{book.authors.join(', ')}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Book Info */}
            <div className="md:col-span-2 space-y-6">
              {/* Status and Rating */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  {getStatusIcon()}
                  <select
                    value={book.status}
                    onChange={(e) => handleStatusChange(e.target.value as Book['status'])}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                  >
                    <option value="to-read">{t('status.to-read')}</option>
                    <option value="reading">{t('status.reading')}</option>
                    <option value="read">{t('status.read')}</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{t('book.rating')}:</span>
                  <Rating value={book.rating} onChange={handleRatingChange} />
                </div>
              </div>

              {/* Description */}
              {book.description && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-primary-600" />
                    Description
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{book.description}</p>
                </div>
              )}

              {/* Book Details */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-primary-600" />
                  Détails du livre
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Nombre de pages</p>
                    <p className="text-lg font-semibold text-gray-800">{book.pageCount || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Année de publication</p>
                    <p className="text-lg font-semibold text-gray-800">{book.publishYear || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Éditeur</p>
                    <p className="text-lg font-semibold text-gray-800">{book.publisher || 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Langue</p>
                    <p className="text-lg font-semibold text-gray-800">{book.language?.toUpperCase() || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Genres */}
              {book.genres && book.genres.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-3">Genres</h2>
                  <div className="flex flex-wrap gap-2">
                    {book.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quotes */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <Quote className="w-5 h-5 mr-2 text-primary-600" />
                    Citations mémorables
                  </h2>
                  <button
                    onClick={() => setShowAddQuote(!showAddQuote)}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    + Ajouter une citation
                  </button>
                </div>

                {showAddQuote && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <textarea
                      value={newQuote}
                      onChange={(e) => setNewQuote(e.target.value)}
                      placeholder="Entrez votre citation..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAddQuote}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Ajouter
                      </button>
                      <button
                        onClick={() => setShowAddQuote(false)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                )}

                {book.quotes && book.quotes.length > 0 ? (
                  <div className="space-y-3">
                    {book.quotes.map((quote, index) => (
                      <div key={index} className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg relative group">
                        <p className="text-gray-700 italic">"{quote}"</p>
                        <button
                          onClick={() => handleDeleteQuote(index)}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Aucune citation pour le moment</p>
                )}
              </div>
            </div>

            {/* Right Column - Personal Notes */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Notes personnelles
                </h2>
                <textarea
                  value={book.comments || ''}
                  onChange={async (e) => await updateBook(book.id, { comments: e.target.value })}
                  placeholder="Vos commentaires personnels sur ce livre..."
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                />
              </div>

              {book.dateRead && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Date de lecture</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(book.dateRead).toLocaleDateString()}
                  </p>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Ajouté à la bibliothèque</p>
                <p className="font-semibold text-gray-800">
                  {new Date(book.addedDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmer la suppression</h3>
              <p className="text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer "{book.title}" de votre bibliothèque ?
                Cette action est irréversible.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteBook}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};