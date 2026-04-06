import type React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Loader } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBooks } from '../contexts/BookContext';
import { openLibrary } from '../services/openLibrary';
import { ISBNScanner } from '../components/Scanner/ISBNScanner';
import type { Book } from '../types';

export const Scanner: React.FC = () => {
  const { t } = useLanguage();
  const { addBook } = useBooks();
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scannedBook, setScannedBook] = useState<Partial<Book> | null>(null);

  const handleScan = async (isbn: string) => {
    setLoading(true);
    setShowScanner(false);
    
    try {
      const bookData = await openLibrary.searchByISBN(isbn);
      if (bookData) {
        setScannedBook(bookData);
      } else {
        alert('Livre non trouvé. Vérifiez l\'ISBN ou ajoutez le livre manuellement.');
      }
    } catch (error) {
      console.error('Error fetching book:', error);
      alert('Erreur lors de la récupération du livre');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToLibrary = async () => {
    if (!scannedBook) return;

    const newBook: Book = {
      id: Date.now().toString(),
      isbn: scannedBook.isbn || '',
      title: scannedBook.title || 'Titre inconnu',
      authors: scannedBook.authors || ['Auteur inconnu'],
      coverUrl: scannedBook.coverUrl || 'https://placehold.co/400x600?text=No+Cover',
      description: scannedBook.description || '',
      pageCount: scannedBook.pageCount || 0,
      publishYear: scannedBook.publishYear || new Date().getFullYear(),
      publisher: scannedBook.publisher || '',
      language: scannedBook.language || 'fr',
      genres: scannedBook.genres || [],
      status: 'to-read',
      rating: 0,
      comments: '',
      quotes: [],
      dateRead: '',
      addedDate: new Date().toISOString().split('T')[0]
    };

    await addBook(newBook);
    alert('Livre ajouté à votre bibliothèque !');
    setScannedBook(null);
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.25)]">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary-600">Scanner</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-950">{t('nav.scanner')}</h1>
              <p className="mt-4 max-w-2xl text-slate-600 leading-7">Ajoutez vos livres en un instant grâce à la lecture automatique de l'ISBN. C’est rapide, simple et parfaitement intégré à votre bibliothèque.</p>
            </div>
            <div className="rounded-[1.75rem] bg-gradient-to-br from-primary-600 to-slate-900 p-8 text-white shadow-xl">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 mb-5">
                <Camera className="h-8 w-8" />
              </div>
              <p className="text-lg font-semibold">Scannez un ISBN</p>
              <p className="mt-3 text-sm text-primary-100 leading-6">Cliquez sur le bouton ci-dessous pour lancer la caméra et ajouter un nouveau livre sans effort.</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto">
        {!showScanner && !loading && !scannedBook && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowScanner(true)}
            className="w-full rounded-[1.75rem] bg-primary-600 px-8 py-12 text-center text-white shadow-2xl shadow-primary-500/20 transition duration-300 hover:bg-primary-700"
          >
            <Camera className="mx-auto h-16 w-16" />
            <h2 className="mt-5 text-2xl font-semibold">{t('scan.instruction')}</h2>
            <p className="mt-3 text-sm text-primary-100">Cliquez pour ouvrir la caméra et scanner un code-barres rapidement.</p>
          </motion.button>
        )}

        {loading && (
          <div className="rounded-[2rem] border border-slate-200 bg-white/90 px-12 py-16 text-center shadow-sm">
            <Loader className="mx-auto h-12 w-12 text-primary-600 animate-spin" />
            <p className="mt-4 text-slate-600">Recherche du livre en cours...</p>
          </div>
        )}

        {scannedBook && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl"
          >
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <img
                src={scannedBook.coverUrl}
                alt={scannedBook.title}
                className="h-72 w-full rounded-3xl object-cover"
              />
              <div className="flex flex-col justify-between gap-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-primary-600">Livre trouvé</p>
                  <h2 className="mt-3 text-3xl font-semibold text-slate-950">{scannedBook.title}</h2>
                  <p className="mt-2 text-slate-600">{scannedBook.authors?.join(', ')}</p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                    {scannedBook.publishYear && <span>📅 {scannedBook.publishYear}</span>}
                    {scannedBook.pageCount && <span>📄 {scannedBook.pageCount} pages</span>}
                  </div>
                  {scannedBook.description && (
                    <p className="mt-6 text-slate-700 leading-7 line-clamp-4">{scannedBook.description}</p>
                  )}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleAddToLibrary}
                    className="flex-1 rounded-2xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
                  >
                    Ajouter à ma bibliothèque
                  </button>
                  <button
                    onClick={() => setScannedBook(null)}
                    className="flex-1 rounded-2xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {showScanner && (
          <ISBNScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
        )}
      </div>

      <div className="mt-12 max-w-3xl mx-auto rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-950 mb-4">Conseils pour un scan parfait</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {[
            'Assurez-vous d\'avoir une bonne luminosité.',
            'Positionnez le code-barres bien centré dans le cadre.',
            'Maintenez l\'appareil stable pendant le scan.',
            'Les codes-barres ISBN-10 et ISBN-13 sont supportés.'
          ].map((tip) => (
            <div key={tip} className="rounded-3xl bg-white p-4 text-sm text-slate-600 shadow-sm">
              {tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};