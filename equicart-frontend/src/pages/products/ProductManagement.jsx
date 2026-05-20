import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAllProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../../store/productSlice';
import { Plus, Edit, Trash2, Search, LogOut } from 'lucide-react';
import { logout } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

const statusBadge = (stock) => {
  if (stock > 10) return 'bg-success/20 text-success';
  if (stock > 0 && stock <= 10) return 'bg-warning/20 text-warning';
  return 'bg-danger/20 text-danger';
};

const ProductManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, error, stats } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    id: '',
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'In Stock',
    imageUrl: '',
    description: '',
  });

  // Load products on mount
  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const filtered = items.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditMode(false);
    setForm({
      id: '',
      name: '',
      category: '',
      price: '',
      stock: '',
      status: 'In Stock',
      imageUrl: '',
      description: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditMode(true);
    setForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
      imageUrl: product.imageUrl,
      description: product.description,
    });
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
      status: form.status,
      imageUrl: form.imageUrl,
      description: form.description,
    };
    if (editMode) {
      await dispatch(updateProduct({ id: form.id, data: payload }));
    } else {
      await dispatch(addProduct(payload));
    }
    setModalOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-textPrimary p-6">
      {/* Top Navbar */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard – Products</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm opacity-80">{user?.username}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-primary hover:text-primary/80"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-surface rounded-xl border border-white/5">
          <p className="text-sm opacity-70">Total Products</p>
          <p className="text-xl font-semibold mt-1">{stats.totalProducts}</p>
        </div>
        <div className="p-4 bg-surface rounded-xl border border-white/5">
          <p className="text-sm opacity-70">In Stock</p>
          <p className="text-xl font-semibold mt-1">
            {items.filter((p) => p.stock > 10).length}
          </p>
        </div>
        <div className="p-4 bg-surface rounded-xl border border-white/5">
          <p className="text-sm opacity-70">Low Stock</p>
          <p className="text-xl font-semibold mt-1">
            {items.filter((p) => p.stock > 0 && p.stock <= 10).length}
          </p>
        </div>
        <div className="p-4 bg-surface rounded-xl border border-white/5">
          <p className="text-sm opacity-70">Out of Stock</p>
          <p className="text-xl font-semibold mt-1">
            {items.filter((p) => p.stock === 0).length}
          </p>
        </div>
      </section>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-white rounded-lg px-4 py-2 transition-colors"
        >
          <Plus size={18} /> Add Product
        </button>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 rounded-lg bg-surface border border-white/5 placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-surface rounded-xl border border-white/5">
        <table className="w-full min-w-[800px] text-left">
          <thead className="bg-surface/50 border-b border-white/5">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="p-3 text-center">
                  Loading products…
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="7" className="p-3 text-center text-danger">
                  {error}
                </td>
              </tr>
            )}
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-white/5 hover:bg-surface/30 transition-colors">
                <td className="p-3">
                  <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" />
                </td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">{product.category}</td>
                <td className="p-3">₹{product.price}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded ${statusBadge(product.stock)}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => openEditModal(product)}
                    className="text-primary hover:text-primary/70 mr-2"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-danger hover:text-danger/70"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-xl w-full max-w-2xl p-6">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Edit' : 'Add'} Product</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="col-span-2 p-2 bg-surface border border-white/5 rounded"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  className="p-2 bg-surface border border-white/5 rounded"
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  className="p-2 bg-surface border border-white/5 rounded"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  required
                  className="p-2 bg-surface border border-white/5 rounded"
                />
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="p-2 bg-surface border border-white/5 rounded"
                >
                  <option>In Stock</option>
                  <option>Low Stock</option>
                  <option>Out of Stock</option>
                </select>
                <input
                  type="url"
                  placeholder="Image URL"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  required
                  className="col-span-2 p-2 bg-surface border border-white/5 rounded"
                />
                <textarea
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="col-span-2 p-2 bg-surface border border-white/5 rounded"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-surface border border-white/5 rounded hover:bg-surface/70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary/20 text-primary border border-primary/30 hover:bg-primary hover:text-white rounded"
                >
                  {editMode ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
