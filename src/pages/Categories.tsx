import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
      setLoading(false);
    }
    fetchCategories();
  }, []);

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>
      <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>All Categories</h1>

      <div className="grid category-grid">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="category-card skeleton" style={{ height: '250px' }}></div>)
        ) : categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="category-card">
              <h3>{cat.name}</h3>
              <p style={{ color: 'var(--color-text-muted)', margin: 'var(--spacing-sm) 0' }}>
                {cat.description}
              </p>
              <Link to={`/shop?category=${cat.id}`} className="btn btn-outline" style={{ marginTop: 'auto' }}>
                Browse Products
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
