export interface Book {
  id: string;
  isbn: string;
  title: string;
  authors: string[];
  coverUrl: string;
  description: string;
  pageCount: number;
  publishYear: number;
  publisher: string;
  language: string;
  genres: string[];
  status: 'read' | 'reading' | 'to-read';
  rating: number;
  comments: string;
  quotes: string[];
  dateRead: string;
  addedDate: string;
}

export interface WishlistItem {
  id: string;
  bookId: string;
  priority: 1 | 2 | 3 | 4 | 5;
  price: number;
  notes: string;
  addedDate: string;
}

export type Language = 'fr' | 'en' | 'ar';

export interface Translations {
  [key: string]: {
    fr: string;
    en: string;
    ar: string;
  };
}

// Exporter également les types pour les props
export interface BookCardProps {
  book: Book;
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: Book['status']) => void;
}

export interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}