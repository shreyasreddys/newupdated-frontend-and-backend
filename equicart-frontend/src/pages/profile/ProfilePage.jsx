import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
        <p className="text-textSecondary text-sm">Manage your account preferences</p>
      </div>

      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'general' ? 'bg-primary/20 text-primary' : 'text-textSecondary hover:text-white'}`}
        >
          General
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'security' ? 'bg-primary/20 text-primary' : 'text-textSecondary hover:text-white'}`}
        >
          Security
        </button>
      </div>

      {activeTab === 'general' && (
        <Card>
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-3xl font-bold text-primary">
              A
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Admin User</h3>
              <p className="text-textSecondary text-sm mb-3">admin@equicart.com</p>
              <Button variant="outline" className="text-sm py-1.5">Change Avatar</Button>
            </div>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Full Name" defaultValue="Admin User" />
              <Input label="Email Address" defaultValue="admin@equicart.com" type="email" />
              <Input label="Phone Number" defaultValue="+1 234 567 8900" />
              <Input label="Role" defaultValue="ADMIN" disabled />
            </div>
            <div className="flex justify-end gap-4">
              <Button variant="ghost">Cancel</Button>
              <Button variant="primary">Save Changes</Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card>
          <h3 className="text-lg font-semibold text-white mb-6">Change Password</h3>
          <form className="space-y-6 max-w-md">
            <Input label="Current Password" type="password" />
            <Input label="New Password" type="password" />
            <Input label="Confirm New Password" type="password" />
            
            <div className="flex justify-end gap-4">
              <Button variant="primary">Update Password</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
