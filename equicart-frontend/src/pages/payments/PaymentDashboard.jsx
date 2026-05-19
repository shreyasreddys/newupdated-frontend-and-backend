import React from 'react';
import Card from '../../components/ui/Card';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';

const dummyTransactions = [
  { id: 'TXN-901', orderId: 'ORD-2026-8901', amount: 1200, status: 'SUCCESS', method: 'Credit Card', date: '2026-05-19 14:30' },
  { id: 'TXN-902', orderId: 'ORD-2026-8902', amount: 450, status: 'PENDING', method: 'PayPal', date: '2026-05-19 15:45' },
  { id: 'TXN-903', orderId: 'ORD-2026-8903', amount: 8900, status: 'FAILED', method: 'Bank Transfer', date: '2026-05-18 09:12' },
];

const PaymentDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payments</h1>
        <p className="text-textSecondary text-sm">Transaction history and status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-success/10 text-success">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-textSecondary">Successful</p>
            <h3 className="text-xl font-bold text-white">$45,231</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-warning/10 text-warning">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-textSecondary">Pending</p>
            <h3 className="text-xl font-bold text-white">$2,140</h3>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-4 rounded-xl bg-danger/10 text-danger">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-textSecondary">Failed</p>
            <h3 className="text-xl font-bold text-white">$8,900</h3>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10">
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Transaction ID</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Order ID</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Method</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Date & Time</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Amount</th>
                <th className="py-4 px-4 text-sm font-medium text-textSecondary">Status</th>
              </tr>
            </thead>
            <tbody>
              {dummyTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-4 text-white font-medium">{txn.id}</td>
                  <td className="py-4 px-4 text-textSecondary">{txn.orderId}</td>
                  <td className="py-4 px-4 text-textSecondary">{txn.method}</td>
                  <td className="py-4 px-4 text-textSecondary">{txn.date}</td>
                  <td className="py-4 px-4 text-white">${txn.amount}</td>
                  <td className="py-4 px-4">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${
                      txn.status === 'SUCCESS' ? 'text-success' : 
                      txn.status === 'PENDING' ? 'text-warning' : 
                      'text-danger'
                    }`}>
                      {txn.status === 'SUCCESS' && <CheckCircle size={14} />}
                      {txn.status === 'PENDING' && <Clock size={14} />}
                      {txn.status === 'FAILED' && <XCircle size={14} />}
                      {txn.status}
                    </span>
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

export default PaymentDashboard;
