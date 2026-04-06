import type React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle, Clock, Heart, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useBooks } from '../hooks/useBooks';
import { BookCard } from '../components/Books/BookCard';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { books } = useBooks();
  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    reading: 0,
    toRead: 0
  });

  useEffect(() => {
    setStats({
      total: books.length,
      read: books.filter(b => b.status === 'read').length,
      reading: books.filter(b => b.status === 'reading').length,
      toRead: books.filter(b => b.status === 'to-read').length
    });
  }, [books]);

  const statCards = [
    { icon: BookOpen, label: t('nav.library'), value: stats.total, color: 'bg-blue-500/10 text-blue-700 border-blue-200' },
    { icon: CheckCircle, label: t('status.read'), value: stats.read, color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200' },
    { icon: Clock, label: t('status.reading'), value: stats.reading, color: 'bg-amber-500/10 text-amber-700 border-amber-200' },
    { icon: Heart, label: t('status.to-read'), value: stats.toRead, color: 'bg-violet-500/10 text-violet-700 border-violet-200' },
  ];

  const recentBooks = books.slice(-6).reverse();

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-primary-600">Tableau de bord</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{t('nav.dashboard')}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">Suivez l'activité de votre bibliothèque, découvrez les livres récents et gardez une vision claire de vos objectifs lecture.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {statCards.map((stat) => (
                <div key={stat.label} className={`rounded-3xl border p-5 ${stat.color}`}>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {recentBooks.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-primary-600">Nouveautés</p>
              <h2 className="text-3xl font-semibold text-slate-950">Vos derniers ajouts</h2>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-4 py-2 text-sm text-slate-600 shadow-sm">
              <TrendingUp className="h-4 w-4" />
              {recentBooks.length} livres ajoutés récemment
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {recentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
};