import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import './about.css';

const values = [
  { title: 'Quality First', desc: 'Every item is tested and verified before it reaches you. No cheap knockoffs.' },
  { title: 'Tech Focused', desc: 'We specialize in accessories for your devices — cables, cases, audio, and more.' },
  { title: 'Fast Shipping', desc: 'Quick dispatch and tracked delivery straight to your door.' },
  { title: 'Real Support', desc: 'We are here before and after your purchase. Your satisfaction matters.' },
];

export default function About() {
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .then(({ count }) => {
        if (count !== null) setProductCount(count);
      });
  }, []);

  const productLabel = productCount !== null ? `${productCount}` : '...';

  return (
    <div className="about-page animate-fade-in-up">

      {/* Hero */}
      <section className="about-hero">
        <div className="container about-hero-container">
          <div className="about-hero-text">
            <p className="about-tag">Tech Accessories</p>
            <h1>Gear built for your everyday setup.</h1>
            <p className="about-desc">
              Alaa Accessories is a curated tech accessories store. We carry
              premium cables, phone cases, audio gear, and desk essentials —
              all quality-checked and ready to ship.
            </p>
            <div className="about-actions">
              <Link to="/shop" className="btn btn-primary">Shop Now</Link>
              <Link to="/categories" className="btn btn-outline">Browse Categories</Link>
            </div>
          </div>
          <div className="about-hero-logo">
            <img src="/logo.png" alt="Alaa Accessories" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-stats">
        <div className="container about-stats-row">
          <div className="about-stat">
            <span className="about-stat-n">{productLabel}</span>
            <span className="about-stat-l">Products</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-n">300+</span>
            <span className="about-stat-l">Happy Customers</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-n">100%</span>
            <span className="about-stat-l">Quality Checked</span>
          </div>
          <div className="about-stat">
            <span className="about-stat-n">Fast</span>
            <span className="about-stat-l">Delivery</span>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="about-story">
        <div className="container about-story-inner">
          <h2>Why we started</h2>
          <p>
            We got tired of buying cheap accessories that broke in a week. So
            we built Alaa Accessories around one simple rule — only sell what
            we would use ourselves. Every product in our store is tested,
            sourced from trusted suppliers, and backed by our guarantee.
          </p>
          <p>
            Whether you need a durable charging cable, a solid phone stand, or
            quality audio gear, we have got you covered.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="container">
          <h2 style={{ marginBottom: 'var(--spacing-xl)' }}>What we stand for</h2>
          <div className="about-values-grid">
            {values.map((v, i) => (
              <div key={i} className="about-value-card">
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container about-cta-inner">
          <div>
            <h2>Ready to upgrade your setup?</h2>
            <p>Explore our full range of tech accessories.</p>
          </div>
          <Link to="/shop" className="btn btn-primary">Shop Collection</Link>
        </div>
      </section>

    </div>
  );
}
