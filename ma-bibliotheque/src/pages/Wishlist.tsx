import type React from 'react';
import { motion } from 'framer-motion';
import { Heart, Trash2, DollarSign, Calendar } from 'lucide-react';
import { useBooks } from '../contexts/BookContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { WishlistItem, Book } from '../types';

export const Wishlist: React.FC = () => {
  const { wishlist, books, removeFromWishlist, updateWishlist } = useBooks();
  const { t } = useLanguage();

  const getBookDetails = (bookId: string): Book | undefined => {
    return books.find(b => b.id === bookId);
  };

  const handlePriorityChange = async (item: WishlistItem, priority: number) => {
    await updateWishlist(item.id, { priority: priority as 1 | 2 | 3 | 4 | 5 });
  };

  const handlePriceChange = async (item: WishlistItem, price: number) => {
    await updateWishlist(item.id, { price });
  };

  const getPriorityLabel = (priority: number) => {
    const labels = {
      1: 'Urgent',
      2: 'Haute',
      3: 'Moyenne',
      4: 'Basse',
      5: 'Très basse'
    };
    return labels[priority as keyof typeof labels] || 'Normal';
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary-600">Liste d'envies</p>
              <h1 className="mt-2 text-4xl font-semibold text-slate-950">{t('nav.wishlist')}</h1>
              <p className="mt-3 text-slate-600">Gardez une vue claire des livres que vous souhaitez acheter ou emprunter.</p>
            </div>
            <div className="inline-flex items-center gap-3 rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-700 shadow-sm">
              <Heart className="h-5 w-5 text-red-500" />
              {wishlist.length} article{wishlist.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </motion.div>

      {wishlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-12 text-center shadow-sm"
        >
          <Heart className="mx-auto mb-4 h-16 w-16 text-red-400" />
          <h3 className="text-2xl font-semibold text-slate-900 mb-2">Votre liste d'envies est vide</h3>
          <p className="text-slate-600">Ajoutez des titres à votre liste pour garder une trace de vos prochaines lectures.</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {wishlist.map((item) => {
            const book = getBookDetails(item.bookId);
            if (!book) return null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
              >
                <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="h-56 w-full object-cover md:h-full"
                  />
                  <div className="p-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <h3 className="text-2xl font-semibold text-slate-950">{book.title}</h3>
                        <p className="mt-2 text-sm text-slate-600">{book.authors.join(', ')}</p>
                        <p className="mt-3 text-sm text-slate-500">{book.publishYear} • {book.pageCount} pages</p>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Retirer
                      </button>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                      <div className="space-y-3 rounded-3xl bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-700">Priorité</p>
                        <div className="flex flex-wrap gap-2">
                          {[1, 2, 3, 4, 5].map((p) => (
                            <button
                              key={p}
                              onClick={() => handlePriorityChange(item, p)}
                              className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                                item.priority === p
                                  ? 'bg-slate-900 text-white'
                                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              }`}
                            >
                              {getPriorityLabel(p)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-3xl bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-700">Budget</p>
                        <div className="mt-2 flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-slate-500" />
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => handlePriceChange(item, parseFloat(e.target.value) || 0)}
                            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>
                    </div>

                    {item.notes && (
                      <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                        <p className="font-medium text-slate-800">Notes</p>
                        <p className="mt-2">{item.notes}</p>
                      </div>
                    )}

                    <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3.5 w-3.5" />
                      Ajouté le {new Date(item.addedDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};