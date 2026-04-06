import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Book, WishlistItem } from '../types';
import { db } from '../services/database';

interface BookContextType {
  books: Book[];
  wishlist: WishlistItem[];
  addBook: (book: Book) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  addToWishlist: (item: WishlistItem) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  updateWishlist: (id: string, updates: Partial<WishlistItem>) => Promise<void>;
  loading: boolean;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // WebSocket connection for real-time updates
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'UPDATE') {
        setBooks(data.data.books || []);
        setWishlist(data.data.wishlist || []);
      }
    };
    
    return () => ws.close();
  }, []);

  const loadData = async () => {
    try {
      const fetchedBooks = await db.getBooks();
      const fetchedWishlist = await db.getWishlist();
      setBooks(fetchedBooks);
      setWishlist(fetchedWishlist);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (book: Book) => {
    await db.addBook(book);
    await loadData();
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    await db.updateBook(id, updates);
    await loadData();
  };

  const deleteBook = async (id: string) => {
    await db.deleteBook(id);
    await loadData();
  };

  const addToWishlist = async (item: WishlistItem) => {
    await db.addToWishlist(item);
    await loadData();
  };

  const removeFromWishlist = async (id: string) => {
    await db.removeFromWishlist(id);
    await loadData();
  };

  const updateWishlist = async (id: string, updates: Partial<WishlistItem>) => {
    await db.updateWishlist(id, updates);
    await loadData();
  };

  return (
    <BookContext.Provider value={{
      books,
      wishlist,
      addBook,
      updateBook,
      deleteBook,
      addToWishlist,
      removeFromWishlist,
      updateWishlist,
      loading
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) throw new Error('useBooks must be used within BookProvider');
  return context;
};