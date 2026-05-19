import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const CartSidebar = () => {
  const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, cartTotal, cartCount } = useContext(CartContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 w-full sm:w-[400px] h-full bg-surface border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-surface z-10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="text-primary" /> My Cart
                <span className="text-sm font-medium text-textSecondary bg-white/5 px-2 py-0.5 rounded-full">{cartCount} items</span>
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/10 rounded-xl text-textSecondary hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-2">
                    <ShoppingBag size={48} className="text-textSecondary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Your cart is empty</h3>
                    <p className="text-textSecondary text-sm max-w-[250px] mx-auto mt-1">Looks like you haven't added anything yet.</p>
                  </div>
                  <Button variant="outline" onClick={() => setIsCartOpen(false)}>Start Shopping</Button>
                </div>
              ) : (
                cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-background" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-white font-medium line-clamp-2 text-sm">{item.name}</h4>
                        <p className="text-textSecondary text-xs mt-1">{item.weight || '1 unit'}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-white">₹{item.price * item.quantity}</span>
                        <div className="flex items-center gap-3 bg-primary/20 text-primary border border-primary/30 rounded-lg px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-white transition-colors"><Minus size={14} /></button>
                          <span className="text-sm font-bold text-white w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-white transition-colors"><Plus size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-4 border-t border-white/10 bg-surface">
                <div className="flex justify-between items-center mb-4 text-sm">
                  <span className="text-textSecondary">Delivery Charge</span>
                  <span className="text-success font-medium">FREE</span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-white font-medium">Grand Total</span>
                  <span className="text-2xl font-bold text-white">₹{cartTotal}</span>
                </div>
                <Button variant="primary" className="w-full py-4 text-lg shadow-primary/30" onClick={handleCheckout}>
                  Proceed to Checkout <ArrowRight size={20} className="ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
