import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../store/CartContext';
import { useToast } from '../components/ui/ToastContext';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('Processing your Cash on Delivery order...');

    // 1. Insert Order
    const { data: orderData, error: orderError } = await supabase.from('orders').insert([{
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      shipping_address: { address, city },
      total_amount: cartTotal,
      payment_method: 'COD',
      status: 'pending'
    }]).select();

    if (orderError) {
      setMessage(`Error placing order: ${orderError.message}`);
      setLoading(false);
      return;
    }

    const orderId = orderData[0].id;

    // 2. Insert Order Items
    const orderItems = cart.map(item => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price_at_time: item.price
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      setMessage(`Error saving items: ${itemsError.message}`);
      setLoading(false);
      return;
    }

    // 3. Construct WhatsApp Message
    const whatsappNumber = "+212688526876"; // Updated actual WhatsApp number

    const productDetails = cart.map(item => (
`*Product:* ${item.name}
*Quantity:* ${item.quantity}
*Price:* ${item.price.toFixed(2)} MAD
*Product link:* ${window.location.origin}/product/${item.slug || ''}`
    )).join('\n\n');

    const whatsappMessage = `🛒 *New Order*

Hello, I’d like to order:

${productDetails}

*Total:* ${cartTotal.toFixed(2)} MAD

*Customer details:*
Name: ${name}
Phone: ${phone}
City: ${city}
Address: ${address}

*Payment:* Cash on delivery

Please confirm my order. Thank you!`;

    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`;

    // 4. Clear cart and redirect
    clearCart();
    setLoading(false);
    setMessage('');
    
    // Show toast and open WhatsApp
    addToast('Order placed successfully!', 'success');
    window.open(whatsappUrl, '_blank');
    navigate('/');
  }

  return (
    <div className="container" style={{ padding: 'var(--spacing-3xl) 0', maxWidth: '600px' }}>
      <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Checkout (Cash on Delivery)</h1>
      
      {message && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-text)', marginBottom: '1rem', borderRadius: '4px', border: '1px solid var(--color-primary)' }}>
          {message}
        </div>
      )}

      <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div>
          <label className="form-label">Full Name</label>
          <input type="text" className="form-input" required value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="form-label">Email</label>
          <input type="email" className="form-input" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="form-label">Phone Number (Required for COD)</label>
          <input type="tel" className="form-input" required value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div>
          <label className="form-label">Street Address</label>
          <textarea className="form-input" rows={2} required value={address} onChange={e => setAddress(e.target.value)} />
        </div>
        <div>
          <label className="form-label">City</label>
          <input type="text" className="form-input" required value={city} onChange={e => setCity(e.target.value)} />
        </div>
        
        <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginTop: 'var(--spacing-md)' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Total to pay on delivery: {cartTotal.toFixed(2)} MAD</h3>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>By placing this order, you agree to pay the total amount in cash upon delivery.</p>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ padding: '1rem', fontSize: '1.125rem' }}>
          {loading ? 'Processing...' : 'Place Order Now'}
        </button>
      </form>
    </div>
  );
}
