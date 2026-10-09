import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCart } from '../../store/CartContext';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import './layout.css';

export default function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="navbar">
        <div className="container navbar-container">
          <div className="navbar-left">
            <button className="mobile-menu-btn" aria-label="Menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="navbar-logo" onClick={closeMenu}>
              <img src="/logo.png" alt="Alaa Accessories" className="navbar-logo-img" />
            </Link>
          </div>

          <nav className="navbar-links">
            <Link to="/shop" className="nav-link">Shop</Link>
            <Link to="/categories" className="nav-link">Categories</Link>
            <Link to="/about" className="nav-link">About</Link>
          </nav>

          <div className="navbar-actions">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="form-input"
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem', width: '150px' }}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="button" onClick={() => setIsSearchOpen(false)} className="icon-btn" aria-label="Close Search">
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button className="icon-btn" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
                <Search size={20} />
              </button>
            )}

            <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart" onClick={closeMenu}>
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      {/* Render menu via portal so it's outside the header stacking context */}
      {isMobileMenuOpen && createPortal(
        <div className="mobile-menu">
          <Link to="/" className="mobile-nav-link" onClick={closeMenu}>Home</Link>
          <Link to="/shop" className="mobile-nav-link" onClick={closeMenu}>Shop</Link>
          <Link to="/categories" className="mobile-nav-link" onClick={closeMenu}>Categories</Link>
          <Link to="/about" className="mobile-nav-link" onClick={closeMenu}>About</Link>
        </div>,
        document.body
      )}
    </>
  );
}
