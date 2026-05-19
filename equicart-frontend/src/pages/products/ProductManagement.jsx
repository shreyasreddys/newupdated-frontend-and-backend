import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';

const dummyProducts = [
  { id: 1, name: 'AWS Cloud Server', category: 'Infrastructure', price: 1200, stock: 50, status: 'In Stock' },
  { id: 2, name: 'Enterprise Database', category: 'Software', price: 800, stock: 12, status: 'Low Stock' },
  { id: 3, name: 'Security License (1yr)', category: 'Security', price: 450, stock: 150, status: 'In Stock' },
  { id: 4, name: 'Load Balancer', category: 'Networking', price: 300, stock: 0, status: 'Out of Stock' },
];

const ProductManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-textSecondary text-sm">Manage your inventory and pricing</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" /> Add Product
        </Button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
            <Input 
              placeholder="Search products..." 
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter size={18} className="mr-2" /> Filter
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Product Name</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Category</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Price</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Status</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyProducts.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-white font-medium">{product.name}</td>
                  <td className="py-4 px-4 text-textSecondary">{product.category}</td>
                  <td className="py-4 px-4 text-white">${product.price}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      product.status === 'In Stock' ? 'bg-success/10 text-success' : 
                      product.status === 'Low Stock' ? 'bg-warning/10 text-warning' : 
                      'bg-danger/10 text-danger'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-textSecondary hover:text-primary transition-colors bg-surface rounded-lg border border-white/5">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-textSecondary hover:text-danger transition-colors bg-surface rounded-lg border border-white/5">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product">
        <form className="space-y-4">
          <Input label="Product Name" placeholder="e.g. AWS Cloud Server" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Price ($)" type="number" placeholder="0.00" />
            <Input label="Stock" type="number" placeholder="0" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-textSecondary">Category</label>
            <select className="bg-surface border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary">
              <option>Infrastructure</option>
              <option>Software</option>
              <option>Security</option>
              <option>Networking</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Product</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductManagement;
