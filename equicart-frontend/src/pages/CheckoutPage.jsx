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
  const [error, setError] = useState('');

  // ADDRESS STATES
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [house, setHouse] = useState('');
  const [area, setArea] = useState('');

  // PAYMENT STATE
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');

  const navigate = useNavigate();

  if (cartItems.length === 0 && !success) {
    navigate('/');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {

      // COMBINE FULL ADDRESS
      const shippingAddress = `
        ${fullName},
        ${mobile},
        ${house},
        ${area}
      `;

      const orderPayload = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),

        totalAmount: cartTotal + 15,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod
      };

      await api.post('/orders', orderPayload);

      setSuccess(true);
      clearCart();

    } catch (err) {
      console.error("Order placement failed", err);

      setError(
        err.response?.data?.message ||
        'Failed to place order. Please try again.'
      );

    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-success/20 text-success rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">
          Order Placed Successfully!
        </h1>

        <p className="text-textSecondary max-w-md mb-8">
          Thank you for shopping with EquiCart.
        </p>

        <Link to="/">
          <Button variant="primary" className="px-8 py-3">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      <Link
        to="/"
        className="flex items-center gap-2 text-textSecondary hover:text-white mb-6 w-fit"
      >
        <ChevronLeft size={20} />
        Back to Store
      </Link>

      <h1 className="text-2xl font-bold text-white mb-8">
        Checkout
      </h1>

      {error && (
        <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl mb-6 text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <form onSubmit={handlePlaceOrder} className="space-y-6">

          {/* ADDRESS */}
          <div className="bg-surface p-6 rounded-2xl border border-white/5">

            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Delivery Address
            </h2>

            <div className="space-y-4">

              <Input
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <Input
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />

              <Input
                placeholder="Flat, House no., Building"
                value={house}
                onChange={(e) => setHouse(e.target.value)}
                required
              />

              <Input
                placeholder="Area, Street, Sector"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                required
              />

            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-surface p-6 rounded-2xl border border-white/5">

            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-primary" />
              Payment Method
            </h2>

            <div className="space-y-3">

              <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CREDIT_CARD'}
                  onChange={() => setPaymentMethod('CREDIT_CARD')}
                />
                <span className="text-white font-medium">
                  Credit / Debit Card
                </span>
              </label>

              <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                />
                <span className="text-white font-medium">
                  UPI / Netbanking
                </span>
              </label>

              <label className="flex items-center gap-3 p-4 border border-white/10 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <span className="text-white font-medium">
                  Cash on Delivery
                </span>
              </label>

            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full py-4 text-lg font-bold"
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : `Pay ₹${cartTotal + 15} & Place Order`
            }
          </Button>

        </form>

        {/* RIGHT SIDE */}
        <div className="bg-surface p-6 rounded-2xl border border-white/5 h-fit">

          <h2 className="text-lg font-semibold text-white mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">

            {cartItems.map(item => (
              <div
                key={item.id}
                className="flex justify-between items-center text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-textSecondary">
                    {item.quantity} x
                  </span>

                  <span className="text-white">
                    {item.name}
                  </span>
                </div>

                <span className="text-white font-medium">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}

          </div>

          <div className="border-t border-white/10 pt-4">

            <div className="flex justify-between text-lg font-bold">
              <span className="text-white">To Pay</span>

              <span className="text-primary">
                ₹{cartTotal + 15}
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;