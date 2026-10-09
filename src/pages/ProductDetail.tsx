import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCart } from '../store/CartContext';
import { useToast } from '../components/ui/ToastContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase.from('products').select(`
        *,
        product_images ( image_url )
      `).eq('slug', slug).single();
      
      if (data) {
        setProduct(data);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>Loading product details...</div>;
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
        <h1>Product Not Found</h1>
        <button onClick={() => navigate('/shop')} className="btn btn-primary" style={{ marginTop: '1rem' }}>Back to Shop</button>
      </div>
    );
  }

  const imageUrl = product.product_images?.[0]?.image_url;

  return (
    <div className="container animate-fade-in-up" style={{ padding: 'var(--spacing-2xl) var(--spacing-lg)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }} className="product-detail-layout">
        
        {/* Mobile stacking, desktop side-by-side using CSS grid/flex would be better, but we use inline for simplicity */}
        <style>{`
          .product-detail-layout {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--spacing-2xl);
          }
          @media (min-width: 768px) {
            .product-detail-layout {
              grid-template-columns: 1fr 1fr;
            }
          }
          .detail-image {
            width: 100%;
            aspect-ratio: 1/1;
            object-fit: cover;
            border-radius: var(--radius-lg);
            border: 1px solid var(--color-border);
          }
        `}</style>

        <div className="animate-fade-in-up delay-1">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="detail-image" />
          ) : (
            <div className="detail-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa', color: 'var(--color-text-muted)' }}>
              No Image Available
            </div>
          )}
        </div>

        <div className="animate-fade-in-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', padding: 'var(--spacing-sm) 0' }}>
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '0.5rem', lineHeight: '1.2' }}>{product.name}</h1>
          <p style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: '600', color: 'var(--color-text)' }}>{product.price.toFixed(2)} MAD</p>
          
          <div style={{ marginTop: 'var(--spacing-lg)' }}>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
              {product.description || "No description provided for this product."}
            </p>
          </div>
          
          <div style={{ marginTop: 'var(--spacing-lg)' }}>
            <p style={{ marginBottom: 'var(--spacing-sm)' }}>
              Availability: <span style={{ fontWeight: '500', color: product.stock_quantity > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </p>
            <button 
              className="btn btn-primary btn-block" 
              style={{ padding: '1rem 1.5rem', fontSize: '1rem', marginTop: 'var(--spacing-md)', borderRadius: 'var(--radius-lg)' }}
              disabled={product.stock_quantity <= 0}
              onClick={() => {
                addToCart(product, 1);
                addToast('Added to cart successfully!');
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
