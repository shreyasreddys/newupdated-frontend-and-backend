import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import api from '../../services/api';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    role: 'CUSTOMER' // Default role
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/users/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-danger/10 rounded-full blur-[120px] pointer-events-none" />

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-2xl font-bold text-white tracking-tight">
        <Package className="text-primary" size={32} />
        <span>Equi<span className="text-primary">Cart</span></span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-textSecondary">Join the cloud-native retail experience</p>
          </div>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
              <Input
                name="username"
                type="text"
                placeholder="Username"
                className="pl-12"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
              <Input
                name="email"
                type="email"
                placeholder="Email Address"
                className="pl-12"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-textSecondary" size={20} />
              <Input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="pl-12"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-textSecondary hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button type="submit" variant="primary" className="w-full py-3" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-textSecondary text-sm mt-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-orange-400 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
