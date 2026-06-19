import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showCheckout, setShowCheckout] = useState(false);
  const [placing, setPlacing]           = useState(false);
  const [form, setForm]                 = useState({
    phone:           user?.phone || '',
    deliveryAddress: user?.address || '',
    notes:           ''
  });
  const [error, setError] = useState('');

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax      = subtotal * 0.05;
  const total    = subtotal + tax;

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!form.phone.trim()) { setError('Phone number is required to place an order.'); return; }
    setError('');
    setPlacing(true);
    try {
      const orderData = {
        items: cart.map(item => ({
          menuItem: item._id,
          name:     item.name,
          quantity: item.quantity,
          price:    item.price
        })),
        totalAmount:     parseFloat(total.toFixed(2)),
        phone:           form.phone.trim(),
        deliveryAddress: form.deliveryAddress.trim() || 'Dine-in / To be collected',
        notes:           form.notes.trim()
      };

      await orderService.createOrder(orderData);
      clearCart();
      navigate('/orders');
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Add some delicious items from our menu!</p>
        <button onClick={() => navigate('/menu')} className="cart-browse-btn">
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-header">
        <h1 className="cart-title">Your Cart</h1>
        <span className="cart-count">{cart.length} item{cart.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="cart-layout">
        {/* Items column */}
        <div className="cart-items-col">
          {cart.map(item => (
            <CartItem
              key={item._id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {/* Summary + checkout column */}
        <div className="cart-summary-col">
          <CartSummary
            items={cart}
            onCheckout={() => setShowCheckout(true)}
          />
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="checkout-overlay" onClick={() => !placing && setShowCheckout(false)}>
          <div className="checkout-modal" onClick={e => e.stopPropagation()}>
            <div className="checkout-modal-header">
              <h2>📋 Confirm Order</h2>
              <button className="checkout-close" onClick={() => !placing && setShowCheckout(false)}>✕</button>
            </div>

            {/* Order summary recap */}
            <div className="checkout-recap">
              {cart.map(item => (
                <div key={item._id} className="checkout-recap-row">
                  <span className="recap-name">{item.name} <span className="recap-qty">×{item.quantity}</span></span>
                  <span className="recap-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="checkout-recap-divider" />
              <div className="checkout-recap-row recap-tax">
                <span>Tax (5%)</span><span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="checkout-recap-row recap-total">
                <span>Total</span><span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="checkout-field">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  required
                />
              </div>

              <div className="checkout-field">
                <label>Delivery / Table Address</label>
                <input
                  type="text"
                  placeholder="Table no. or delivery address (optional)"
                  value={form.deliveryAddress}
                  onChange={e => setForm(p => ({ ...p, deliveryAddress: e.target.value }))}
                />
              </div>

              <div className="checkout-field">
                <label>Special Instructions</label>
                <textarea
                  rows={2}
                  placeholder="Any allergies or special requests?"
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                />
              </div>

              {error && <p className="checkout-error">⚠️ {error}</p>}

              <div className="checkout-actions">
                <button type="button" className="checkout-btn-cancel"
                  onClick={() => setShowCheckout(false)} disabled={placing}>
                  Go Back
                </button>
                <button type="submit" className="checkout-btn-place" disabled={placing}>
                  {placing ? '⏳ Placing...' : `✓ Place Order · ₹${total.toFixed(2)}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
