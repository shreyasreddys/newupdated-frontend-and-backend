import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Search, Eye, RefreshCw } from 'lucide-react';

const dummyOrders = [
  { id: 'ORD-2026-8901', customer: 'John Doe', date: '2026-05-19', total: 1200, status: 'Delivered' },
  { id: 'ORD-2026-8902', customer: 'Jane Smith', date: '2026-05-19', total: 450, status: 'Processing' },
  { id: 'ORD-2026-8903', customer: 'Acme Corp', date: '2026-05-18', total: 8900, status: 'Failed' },
  { id: 'ORD-2026-8904', customer: 'Global Tech', date: '2026-05-18', total: 320, status: 'Shipped' },
];

const OrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-textSecondary text-sm">Track and manage customer orders</p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={18} />
            <Input 
              placeholder="Search order ID or customer..." 
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Order ID</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Customer</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Date</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Total</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Status</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dummyOrders.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-white font-medium">{order.id}</td>
                  <td className="py-4 px-4 text-textSecondary">{order.customer}</td>
                  <td className="py-4 px-4 text-textSecondary">{order.date}</td>
                  <td className="py-4 px-4 text-white">${order.total}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${
                      order.status === 'Delivered' ? 'bg-success/10 text-success' : 
                      order.status === 'Processing' ? 'bg-primary/10 text-primary' : 
                      order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-500' : 
                      'bg-danger/10 text-danger'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-end gap-2">
                      {order.status === 'Failed' && (
                        <button className="p-2 text-textSecondary hover:text-warning transition-colors bg-surface rounded-lg border border-white/5" title="Retry Order">
                          <RefreshCw size={16} />
                        </button>
                      )}
                      <button className="p-2 text-textSecondary hover:text-white transition-colors bg-surface rounded-lg border border-white/5" title="View Details">
                        <Eye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default OrderManagement;
