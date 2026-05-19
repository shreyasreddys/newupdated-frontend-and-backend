import React from 'react';
import Card from '../../components/ui/Card';
import { Server, Users, AlertTriangle, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummySystemData = [
  { name: 'User Service', load: 45, status: 'Healthy' },
  { name: 'Product Service', load: 82, status: 'Warning' },
  { name: 'Order Service', load: 60, status: 'Healthy' },
  { name: 'Payment Service', load: 25, status: 'Healthy' },
  { name: 'Notification', load: 15, status: 'Healthy' },
];

const StatCard = ({ title, value, subtext, icon: Icon, color }) => (
  <Card hover className="flex items-start p-6">
    <div className={`p-4 rounded-xl mr-4 bg-${color}/10 text-${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-textSecondary text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      <p className="text-xs text-textSecondary mt-2">{subtext}</p>
    </div>
  </Card>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Console</h1>
        <p className="text-textSecondary text-sm">System monitoring and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value="12,450" subtext="+150 this week" icon={Users} color="primary" />
        <StatCard title="Active Instances" value="8 / 10" subtext="AWS ECS Clusters" icon={Server} color="success" />
        <StatCard title="System Alerts" value="3" subtext="Requires attention" icon={AlertTriangle} color="warning" />
        <StatCard title="Avg. Response" value="124ms" subtext="Across all APIs" icon={Activity} color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Microservices Load</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dummySystemData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <YAxis stroke="#888" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#262626'}}
                  contentStyle={{ backgroundColor: '#171717', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                />
                <Bar dataKey="load" fill="#FF4500" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Recent System Logs</h3>
          <div className="space-y-4">
            {[
              { time: '10:45 AM', level: 'WARN', msg: 'High CPU usage detected on Product Service', service: 'Product' },
              { time: '10:42 AM', level: 'INFO', msg: 'Scaling up Order Service to 3 instances', service: 'Order' },
              { time: '10:30 AM', level: 'INFO', msg: 'Database backup completed successfully', service: 'Database' },
              { time: '09:15 AM', level: 'ERROR', msg: 'Payment Gateway timeout (Stripe)', service: 'Payment' },
              { time: '08:00 AM', level: 'INFO', msg: 'Daily report generated', service: 'System' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4 p-3 bg-surface border border-white/5 rounded-lg">
                <div className="text-xs text-textSecondary whitespace-nowrap pt-0.5">{log.time}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      log.level === 'INFO' ? 'bg-blue-500/10 text-blue-500' :
                      log.level === 'WARN' ? 'bg-warning/10 text-warning' :
                      'bg-danger/10 text-danger'
                    }`}>
                      {log.level}
                    </span>
                    <span className="text-xs text-textSecondary">[{log.service}]</span>
                  </div>
                  <p className="text-sm text-white">{log.msg}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
