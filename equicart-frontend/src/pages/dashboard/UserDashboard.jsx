import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingCart, Users, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import Card from '../../components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendUp }) => (
  <Card hover className="flex items-center p-6">
    <div className={`p-4 rounded-xl mr-4 ${trendUp ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
      <Icon size={24} />
    </div>
    <div className="flex-1">
      <p className="text-textSecondary text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
    </div>
    <div className={`flex items-center text-sm font-medium ${trendUp ? 'text-success' : 'text-danger'}`}>
      {trendUp ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
      {trend}
    </div>
  </Card>
);

const UserDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Overview</h1>
        <p className="text-textSecondary text-sm">Last 7 days</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$45,231" icon={DollarSign} trend="12.5%" trendUp={true} />
        <StatCard title="Total Orders" value="1,245" icon={ShoppingCart} trend="8.2%" trendUp={true} />
        <StatCard title="New Customers" value="342" icon={Users} trend="2.1%" trendUp={false} />
        <StatCard title="Active Sessions" value="892" icon={Activity} trend="5.4%" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Analytics</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dummyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4500" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF4500" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#FF4500' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#FF4500" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                <div>
                  <p className="text-sm text-white">Order #{1000 + i} placed</p>
                  <p className="text-xs text-textSecondary mt-1">{i * 12} mins ago</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
