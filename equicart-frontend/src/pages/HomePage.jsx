import React, { useContext } from 'react';
import { Plus } from 'lucide-react';
import { CartContext } from '../context/CartContext';

// Dummy Categories
const categories = [
  { id: 1, name: 'Fresh Vegetables', image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=150&q=80' },
  { id: 2, name: 'Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=150&q=80' },
  { id: 3, name: 'Dairy & Bread', image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=150&q=80' },
  { id: 4, name: 'Snacks', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=150&q=80' },
  { id: 5, name: 'Beverages', image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=150&q=80' },
  { id: 6, name: 'Meat', image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=150&q=80' },
  { id: 7, name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=150&q=80' },
  { id: 8, name: 'Personal Care', image: 'https://images.unsplash.com/photo-1629367305949-0d12e9aa13c1?w=150&q=80' },
];

// Dummy Products
const dummyProducts = [
  { id: 101, name: 'Farm Fresh Onions', weight: '1 kg', price: 45, originalPrice: 60, image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=300&q=80', time: '10 MINS' },
  { id: 102, name: 'Red Tomatoes', weight: '500 g', price: 25, image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&q=80', time: '10 MINS' },
  { id: 103, name: 'Amul Taaza Toned Milk', weight: '500 ml', price: 27, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&q=80', time: '8 MINS' },
  { id: 104, name: 'Britannia Whole Wheat Bread', weight: '400 g', price: 50, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80', time: '12 MINS' },
  { id: 105, name: 'Lay\'s India\'s Magic Masala', weight: '50 g', price: 20, image: 'https://images.unsplash.com/photo-1600952841320-db92ec4047ca?w=300&q=80', time: '10 MINS' },
  { id: 106, name: 'Thums Up Soft Drink', weight: '330 ml', price: 40, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80', time: '10 MINS' },
];

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-surface rounded-2xl p-3 border border-white/5 hover:border-primary/50 transition-colors group relative flex flex-col h-full">
      <div className="relative aspect-square mb-3 rounded-xl overflow-hidden bg-background">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-2 left-2 bg-background/80 backdrop-blur text-[10px] font-bold px-1.5 py-0.5 rounded text-white flex items-center gap-1">
          ⏱ {product.time}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col">
        <h3 className="text-white text-sm font-medium line-clamp-2 leading-tight">{product.name}</h3>
        <p className="text-textSecondary text-xs mt-1">{product.weight}</p>
        
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <span className="text-white font-bold">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-textSecondary text-xs line-through ml-1">₹{product.originalPrice}</span>
            )}
          </div>
          <button 
            onClick={() => addToCart(product)}
            className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-white rounded-lg px-3 py-1.5 text-sm font-bold transition-colors flex items-center gap-1"
          >
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-10">
      
      {/* Promotional Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-gradient-to-r from-orange-600 to-red-600 p-6 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Groceries in<br/>10 Minutes</h2>
          <p className="text-white/80 text-sm max-w-[200px]">Everything you need, delivered lightning fast.</p>
        </div>
        <div className="relative rounded-2xl overflow-hidden aspect-[21/9] bg-gradient-to-r from-blue-900 to-black p-6 flex flex-col justify-center border border-white/10">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">Electronics<br/>Mega Sale</h2>
          <p className="text-white/80 text-sm max-w-[200px]">Up to 40% off on top brands.</p>
        </div>
      </div>

      {/* Categories Grid */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Shop by Category</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {categories.map(category => (
            <div key={category.id} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-surface border border-white/5 group-hover:border-primary/50 transition-colors p-1">
                <img src={category.image} alt={category.name} className="w-full h-full object-cover rounded-xl" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-textSecondary text-center group-hover:text-white transition-colors line-clamp-2">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Product Section 1 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Bestsellers</h2>
          <button className="text-primary text-sm font-medium hover:text-orange-400">See all</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {dummyProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Product Section 2 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Daily Needs</h2>
          <button className="text-primary text-sm font-medium hover:text-orange-400">See all</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {dummyProducts.slice().reverse().map(product => (
            <ProductCard key={product.id + 'rev'} product={product} />
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;
