import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Loader } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBooks } from '../contexts/BookContext';
import { openLibrary } from '../services/openLibrary';
import type { Book } from '../types';
import { SearchBar } from '../components/Common/SearchBar';

export const Search: React.FC = () => {
  const { t } = useLanguage();
  const { addBook } = useBooks();
  const [searchResults, setSearchResults] = useState<Partial<Book>[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState<'title' | 'author'>('title');

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      let results;
      if (searchType === 'title') {
        results = await openLibrary.searchByTitle(query);
      } else {
        results = await openLibrary.searchByAuthor(query);
      }
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (bookData: Partial<Book>) => {
    const newBook: Book = {
      id: Date.now().toString(),
      isbn: bookData.isbn || '',
      title: bookData.title || 'Titre inconnu',
      authors: bookData.authors || ['Auteur inconnu'],
      coverUrl: bookData.coverUrl || 'https://placehold.co/400x600?text=No+Cover',
      description: bookData.description || '',
      pageCount: bookData.pageCount || 0,
      publishYear: bookData.publishYear || new Date().getFullYear(),
      publisher: bookData.publisher || '',
      language: bookData.language || 'fr',
      genres: bookData.genres || [],
      status: 'to-read',
      rating: 0,
      comments: '',
      quotes: [],
      dateRead: '',
      addedDate: new Date().toISOString().split('T')[0]
    };

    await addBook(newBook);
    alert('Livre ajouté à votre bibliothèque !');
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.25)]">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary-600">Recherche intelligente</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-950">{t('nav.search')}</h1>
          <p className="mt-4 max-w-2xl text-slate-600 leading-7">Trouvez rapidement un livre par titre ou par auteur, puis ajoutez-le directement dans votre bibliothèque.</p>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Recherche</h2>
              <p className="mt-1 text-sm text-slate-500">Sélectionnez votre mode de recherche et lancez la requête.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            {['title', 'author'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSearchType(mode as 'title' | 'author')}
                className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                  searchType === mode
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {mode === 'title' ? 'Par titre' : 'Par auteur'}
              </button>
            ))}
          </div>

          <div className="max-w-2xl">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-950 mb-4">Astuces rapides</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>• Mettez des mots-clés clairs : titre, auteur ou ISBN.</li>
            <li>• Cliquez sur le résultat pour l'ajouter directement.</li>
            <li>• Si aucun résultat n'apparaît, essayez une autre orthographe.</li>
          </ul>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-12 text-center shadow-sm">
          <Loader className="mx-auto h-12 w-12 text-primary-600 animate-spin" />
          <p className="mt-4 text-slate-600">Recherche en cours...</p>
        </div>
      ) : searchResults.length > 0 ? (
        <div className="mt-8 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-slate-950">{searchResults.length} résultat(s)</h2>
            <p className="text-sm text-slate-500">Résultats trouvés dans la base OpenLibrary.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {searchResults.map((book, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm hover:shadow-lg transition"
              >
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="h-72 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-slate-950 mb-2 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{book.authors?.join(', ')}</p>
                  {book.publishYear && (
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-4">{book.publishYear} • {book.pageCount} pages</p>
                  )}
                  <button
                    onClick={() => handleAddBook(book)}
                    className="w-full rounded-2xl bg-primary-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                  >
                    Ajouter à ma bibliothèque
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-[2rem] border border-dashed border-slate-300 bg-white/80 p-12 text-center shadow-sm">
          <BookOpen className="mx-auto h-16 w-16 text-slate-400" />
          <p className="mt-4 text-slate-600">Recherchez un livre pour voir les résultats ici.</p>
        </div>
      )}
    </div>
  );
};