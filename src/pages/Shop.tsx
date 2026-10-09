import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useSearchParams } from 'react-router-dom';
import './home.css'; // Reusing the grid and card styles

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('q');

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let query = supabase.from('products').select(`
        *,
        product_images ( image_url )
      `).eq('is_active', true);
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      const { data } = await query;
      if (data) setProducts(data);
      setLoading(false);
    }
    fetchProducts();
  }, [categoryId, searchQuery]);

  return (
    <div className="container animate-fade-in-up" style={{ padding: 'var(--spacing-3xl) 0' }}>
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1>{searchQuery ? `Search Results for "${searchQuery}"` : 'Shop All Products'}</h1>
        {(categoryId || searchQuery) && <p>Filtering results. <Link to="/shop" style={{ textDecoration: 'underline' }}>Clear filter</Link></p>}
      </div>

      <div className="grid product-grid animate-fade-in-up delay-1">
        {loading ? (
          [1, 2, 3, 4].map((i) => <div key={i} className="product-card skeleton" style={{ height: '350px' }}></div>)
        ) : products.length === 0 ? (
          <p>No products found in this category.</p>
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
  );
}
