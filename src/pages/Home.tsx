import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './home.css';

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [catsRes, prodsRes] = await Promise.all([
        supabase.from('categories').select('*').limit(3),
        supabase.from('products').select(`
          *,
          product_images ( image_url )
        `).eq('is_active', true).limit(4)
      ]);
      
      if (catsRes.data) setCategories(catsRes.data);
      if (prodsRes.data) setProducts(prodsRes.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-content animate-fade-in-up">
            <h1 className="hero-title">Premium essentials for your everyday life.</h1>
            <p className="hero-subtitle">
              Carefully curated products built for durability, design, and practical use. 
              Explore our latest collection of accessories and essentials.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
            </div>
          </div>
          <div className="hero-image-wrapper animate-fade-in-up delay-1">
            {products.length > 0 && products[0].product_images?.[0]?.image_url ? (
               <img 
                 src={products[0].product_images[0].image_url} 
                 alt="Featured Product" 
                 className="hero-image"
                 style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }}
               />
            ) : (
              <div className="hero-image-placeholder">
                <span>Featured Product</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="featured-section animate-fade-in-up delay-2">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/shop" className="link-arrow">View all products &rarr;</Link>
          </div>
          <div className="grid category-grid">
            {loading ? (
              [1, 2, 3].map((i) => <div key={i} className="category-card skeleton" style={{ height: '250px' }}></div>)
            ) : categories.length === 0 ? (
              <p>No categories found.</p>
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="category-card">
                  <h3>{cat.name}</h3>
                  <Link to={`/shop?category=${cat.id}`} className="btn btn-outline" style={{ marginTop: 'var(--spacing-md)' }}>Shop Now</Link>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Latest Products */}
      <section className="featured-section animate-fade-in-up delay-3">
        <div className="container">
          <div className="section-header">
            <h2>New Arrivals</h2>
            <Link to="/shop" className="link-arrow">View all products &rarr;</Link>
          </div>
          <div className="grid product-grid">
            {loading ? (
              [1, 2, 3, 4].map((i) => <div key={i} className="product-card skeleton" style={{ height: '350px' }}></div>)
            ) : products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              products.map((prod) => (
                <Link to={`/product/${prod.slug}`} key={prod.id} style={{ display: 'block' }}>
                  <div className="product-card-real">
                    <div className="product-image-container">
                      {prod.product_images && prod.product_images.length > 0 ? (
                        <img src={prod.product_images[0].image_url} alt={prod.name} />
                      ) : (
                        <div className="product-image-placeholder">No Image</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{prod.name}</h3>
                      <p className="product-price">{prod.price.toFixed(2)} MAD</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
