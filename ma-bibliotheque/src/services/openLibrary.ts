import type { Book } from '../types';

interface OpenLibraryBook {
  title: string;
  authors?: Array<{ name: string }>;
  covers?: number[];
  description?: string | { value: string };
  number_of_pages?: number;
  publish_date?: string;
  publishers?: string[];
  languages?: Array<{ key: string }>;
  subjects?: string[];
}

export class OpenLibraryService {
  private async fetchJSON(url: string) {
    const response = await fetch(url);
    return response.json();
  }

  async searchByISBN(isbn: string): Promise<Partial<Book> | null> {
    try {
      const data = await this.fetchJSON(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`);
      const bookData = data[`ISBN:${isbn}`] as OpenLibraryBook;
      
      if (!bookData) return null;

      const coverId = bookData.covers?.[0];
      const coverUrl = coverId 
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
        : 'https://placehold.co/400x600?text=No+Cover';

      return {
        isbn,
        title: bookData.title,
        authors: bookData.authors?.map(a => a.name) || ['Unknown'],
        coverUrl,
        description: typeof bookData.description === 'string' 
          ? bookData.description 
          : bookData.description?.value || 'No description available',
        pageCount: bookData.number_of_pages || 0,
        publishYear: (() => {
          const yearString = bookData.publish_date?.split('-')[0];
          return yearString ? parseInt(yearString, 10) : new Date().getFullYear();
        })(),
        publisher: bookData.publishers?.[0] || 'Unknown',
        language: bookData.languages?.[0]?.key?.split('/').pop() || 'en',
        genres: bookData.subjects?.slice(0, 5) || []
      };
    } catch (error) {
      console.error('Error fetching book by ISBN:', error);
      return null;
    }
  }

  async searchByTitle(title: string): Promise<Partial<Book>[]> {
    try {
      const data = await this.fetchJSON(`https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=20`);
      
      return data.docs.map((doc: any) => ({
        isbn: doc.isbn?.[0] || '',
        title: doc.title,
        authors: doc.author_name || ['Unknown'],
        coverUrl: doc.cover_i 
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : 'https://placehold.co/400x600?text=No+Cover',
        description: `${doc.title} by ${doc.author_name?.join(', ') || 'Unknown'}`,
        pageCount: doc.number_of_pages_median || 0,
        publishYear: doc.first_publish_year || new Date().getFullYear(),
        publisher: doc.publisher?.[0] || 'Unknown',
        language: doc.language?.[0] || 'en',
        genres: doc.subject?.slice(0, 5) || []
      }));
    } catch (error) {
      console.error('Error searching books:', error);
      return [];
    }
  }

  async searchByAuthor(author: string): Promise<Partial<Book>[]> {
    return this.searchByTitle(author); // OpenLibrary search works for authors too
  }
}

export const openLibrary = new OpenLibraryService();