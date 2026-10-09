import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';

const currentYear = new Date().getFullYear();

export default function Layout() {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <img src="/logo.png" alt="Alaa Accessories" style={{ height: '60px', marginBottom: '0.75rem', filter: 'invert(1) brightness(2)' }} />
              <p>Premium everyday accessories delivered to your door. Quality guaranteed.</p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/shop">Shop All</Link></li>
                <li><Link to="/categories">Categories</Link></li>
                <li><Link to="/cart">Cart</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Customer Service</h4>
              <ul>
                <li><Link to="#">Contact Us</Link></li>
                <li><Link to="#">Shipping Info</Link></li>
                <li><Link to="#">Returns</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {currentYear} Alaa Accessories. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
