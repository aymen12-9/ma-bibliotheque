import { useState, useEffect, useCallback } from 'react';
import type { Book, WishlistItem } from '../types';
import { db } from '../services/database';

interface UseBooksReturn {
  books: Book[];
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
  addBook: (book: Book) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  getBookById: (id: string) => Book | undefined;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  updateWishlist: (id: string, updates: Partial<WishlistItem>) => Promise<void>;
  getWishlistItem: (id: string) => WishlistItem | undefined;
  refreshData: () => Promise<void>;
}

export const useBooks = (): UseBooksReturn => {
  const [books, setBooks] = useState<Book[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    try {
      setError(null);
      const [fetchedBooks, fetchedWishlist] = await Promise.all([
        db.getBooks(),
        db.getWishlist()
      ]);
      setBooks(fetchedBooks);
      setWishlist(fetchedWishlist);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error('Error loading books:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();

    // WebSocket connection for real-time updates
    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connectWebSocket = () => {
      const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'UPDATE') {
            setBooks(data.data.books || []);
            setWishlist(data.data.wishlist || []);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Erreur de connexion en temps réel');
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        reconnectTimer = setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    return () => {
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [loadBooks]);

  const addBook = useCallback(async (book: Book) => {
    try {
      setError(null);
      const newBook = await db.addBook(book);
      setBooks(prev => [...prev, newBook]);
    } catch (err) {
      setError('Erreur lors de l\'ajout du livre');
      console.error('Error adding book:', err);
      throw err;
    }
  }, []);

  const updateBook = useCallback(async (id: string, updates: Partial<Book>) => {
    try {
      setError(null);
      const updatedBook = await db.updateBook(id, updates);
      setBooks(prev => prev.map(book => book.id === id ? updatedBook : book));
    } catch (err) {
      setError('Erreur lors de la mise à jour du livre');
      console.error('Error updating book:', err);
      throw err;
    }
  }, []);

  const deleteBook = useCallback(async (id: string) => {
    try {
      setError(null);
      await db.deleteBook(id);
      setBooks(prev => prev.filter(book => book.id !== id));
      // Also remove from wishlist if present
      const wishlistItem = wishlist.find(item => item.bookId === id);
      if (wishlistItem) {
        await db.removeFromWishlist(wishlistItem.id);
        setWishlist(prev => prev.filter(item => item.bookId !== id));
      }
    } catch (err) {
      setError('Erreur lors de la suppression du livre');
      console.error('Error deleting book:', err);
      throw err;
    }
  }, [wishlist]);

  const getBookById = useCallback((id: string) => {
    return books.find(book => book.id === id);
  }, [books]);

  const addToWishlist = useCallback(async (item: WishlistItem) => {
    try {
      setError(null);
      const newItem = await db.addToWishlist(item);
      setWishlist(prev => [...prev, newItem]);
    } catch (err) {
      setError('Erreur lors de l\'ajout à la wishlist');
      console.error('Error adding to wishlist:', err);
      throw err;
    }
  }, []);

  const removeFromWishlist = useCallback(async (id: string) => {
    try {
      setError(null);
      await db.removeFromWishlist(id);
      setWishlist(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression de la wishlist');
      console.error('Error removing from wishlist:', err);
      throw err;
    }
  }, []);

  const updateWishlist = useCallback(async (id: string, updates: Partial<WishlistItem>) => {
    try {
      setError(null);
      const updatedItem = await db.updateWishlist(id, updates);
      setWishlist(prev => prev.map(item => item.id === id ? updatedItem : item));
    } catch (err) {
      setError('Erreur lors de la mise à jour de la wishlist');
      console.error('Error updating wishlist:', err);
      throw err;
    }
  }, []);

  const getWishlistItem = useCallback((id: string) => {
    return wishlist.find(item => item.id === id);
  }, [wishlist]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    await loadBooks();
  }, [loadBooks]);

  return {
    books,
    wishlist,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    getBookById,
    addToWishlist,
    removeFromWishlist,
    updateWishlist,
    getWishlistItem,
    refreshData
  };
};