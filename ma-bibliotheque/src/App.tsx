import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { BookProvider } from './contexts/BookContext';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Library } from './pages/Library';
import { Wishlist } from './pages/Wishlist';
import { Search } from './pages/Search';
import { Scanner } from './pages/Scanner';
import './styles/globals.css';

function App() {
  return (
    <LanguageProvider>
      <BookProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/library" element={<Library />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/search" element={<Search />} />
              <Route path="/scanner" element={<Scanner />} />
            </Routes>
          </Layout>
        </Router>
      </BookProvider>
    </LanguageProvider>
  );
}

export default App;