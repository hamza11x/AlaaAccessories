import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container" style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
        <h1 style={{ marginBottom: 'var(--spacing-md)' }}>Shopping Cart</h1>
        <p style={{ marginBottom: 'var(--spacing-xl)', color: 'var(--color-text-muted)' }}>Your cart is currently empty.</p>
        <Link to="/shop" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in-up" style={{ padding: 'var(--spacing-3xl) 0' }}>
      <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Shopping Cart</h1>
      
      <style>{`
        .cart-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-xl);
        }
        @media (min-width: 768px) {
          .cart-layout {
            grid-template-columns: 2fr 1fr;
          }
        }
      `}</style>

      <div className="cart-layout">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: 'var(--spacing-md)', padding: 'var(--spacing-md)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ width: '100px', height: '100px', backgroundColor: '#fafafa', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>No Img</div>
                )}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem' }}>{item.name}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>Qty: {item.quantity}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <p style={{ fontWeight: '600' }}>{(item.price * item.quantity).toFixed(2)} MAD</p>
                  <button onClick={() => removeFromCart(item.id)} className="icon-btn" style={{ color: 'var(--color-error)' }} aria-label="Remove">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: '#fafafa', padding: 'var(--spacing-xl)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', height: 'fit-content' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-md)' }}>Order Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
            <span>Subtotal</span>
            <span>{cartTotal.toFixed(2)} MAD</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-md)' }}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)', fontWeight: '700', fontSize: '1.25rem' }}>
            <span>Total</span>
            <span>{cartTotal.toFixed(2)} MAD</span>
          </div>
          <button 
            className="btn btn-primary btn-block"
            onClick={() => navigate('/checkout')}
            style={{ padding: '1rem' }}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
