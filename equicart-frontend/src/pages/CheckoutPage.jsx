import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle, MapPin, CreditCard, ChevronLeft } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import api from '../services/api';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  if (cartItems.length === 0 && !success) {
    navigate('/');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Dummy payload for the Order Service
      const orderPayload = {
        items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity })),
        totalAmount: cartTotal,
        shippingAddress: "BTM Layout, Bangalore",
        paymentMethod: "CREDIT_CARD"
      };
      
      // Simulate API Call to Order/Payment Service
      // await api.post('/orders', orderPayload);
      
      setTimeout(() => {
        setSuccess(true);
        clearCart();
        setLoading(false);
      }, 1500);

    } catch (err) {
      console.error("Order failed", err);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Order Placed Successfully!</h1>
        <p className="text-textSecondary max-w-md mb-8">
          Thank you for shopping with EquiCart. Your order will be delivered in 10 minutes.
        </p>
        <Link to="/">
          <Button variant="primary" className="px-8 py-3">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="flex items-center gap-2 text-textSecondary hover:text-white mb-6 w-fit">
        <ChevronLeft size={20} /> Back to Store
      </Link>
      
      <h1 className="text-2xl font-bold text-white mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Col: Forms */}
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div className="bg-surface p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-primary" /> Delivery Address
            </h2>
            <div className="space-y-4">
              <Input placeholder="Full Name" required />
              <Input placeholder="Mobile Number" required />
              <Input placeholder="Flat, House no., Building, Company" required />
              <Input placeholder="Area, Street, Sector, Village" required />
            </div>
          </div>

          <div className="bg-surface p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-primary" /> Payment Method
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                <input type="radio" name="payment" className="text-primary focus:ring-primary" defaultChecked />
                <span className="text-white font-medium">Credit / Debit Card</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                <input type="radio" name="payment" className="text-primary focus:ring-primary" />
                <span className="text-white font-medium">UPI / Netbanking</span>
              </label>
              <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl cursor-pointer hover:border-primary/50 transition-colors">
                <input type="radio" name="payment" className="text-primary focus:ring-primary" />
                <span className="text-white font-medium">Cash on Delivery</span>
              </label>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full py-4 text-lg font-bold shadow-lg shadow-primary/20" disabled={loading}>
            {loading ? 'Processing...' : `Pay ₹${cartTotal} & Place Order`}
          </Button>
        </form>

        {/* Right Col: Order Summary */}
        <div className="bg-surface p-6 rounded-2xl border border-white/5 h-fit sticky top-24">
          <h2 className="text-lg font-semibold text-white mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar pr-2">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-textSecondary">{item.quantity} x</span>
                  <span className="text-white line-clamp-1 max-w-[150px]">{item.name}</span>
                </div>
                <span className="text-white font-medium">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-textSecondary">Item Total</span>
              <span className="text-white">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-textSecondary">Handling Fee</span>
              <span className="text-white">₹15</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-textSecondary">Delivery Fee</span>
              <span className="text-success font-medium">FREE</span>
            </div>
            <div className="flex justify-between text-lg font-bold mt-4 pt-4 border-t border-white/10">
              <span className="text-white">To Pay</span>
              <span className="text-primary">₹{cartTotal + 15}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
