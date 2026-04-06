import type { Book, WishlistItem } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class DatabaseService {
  async getBooks(): Promise<Book[]> {
    const response = await fetch(`${API_URL}/books`);
    return response.json();
  }

  async getWishlist(): Promise<WishlistItem[]> {
    const response = await fetch(`${API_URL}/wishlist`);
    return response.json();
  }

  async addBook(book: Book): Promise<Book> {
    const response = await fetch(`${API_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(book)
    });
    if (!response.ok) {
      throw new Error(`Failed to add book: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async updateBook(id: string, updates: Partial<Book>): Promise<Book> {
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) {
      throw new Error(`Failed to update book: ${response.status} ${response.statusText}`);
    }
    return response.json();
  }

  async deleteBook(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/books/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      throw new Error(`Failed to delete book: ${response.status} ${response.statusText}`);
    }
  }

  async addToWishlist(item: WishlistItem): Promise<WishlistItem> {
    const response = await fetch(`${API_URL}/wishlist`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    return response.json();
  }

  async removeFromWishlist(id: string): Promise<void> {
    await fetch(`${API_URL}/wishlist/${id}`, { method: 'DELETE' });
  }

  async updateWishlist(id: string, updates: Partial<WishlistItem>): Promise<WishlistItem> {
    const response = await fetch(`${API_URL}/wishlist/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return response.json();
  }
}

export const db = new DatabaseService();