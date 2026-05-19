import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cloud, Shield, Zap, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
              The Cloud-Native <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                Enterprise Retail Platform
              </span>
            </h1>
            <p className="text-lg md:text-xl text-textSecondary max-w-3xl mx-auto mb-10">
              EquiCart delivers unparalleled speed, scale, and security. Built on modern microservices architecture and powered by AWS. Experience the future of e-commerce.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button variant="primary" className="text-lg px-8 py-4 w-full sm:w-auto">
                  Start Free Trial <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="text-lg px-8 py-4 w-full sm:w-auto">
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 bottom-0 h-full pointer-events-none" />
            <div className="glass-card p-2 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80" 
                alt="Dashboard Preview" 
                className="w-full h-auto rounded-xl opacity-80 mix-blend-screen grayscale"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface/30 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Enterprise-Grade Architecture</h2>
            <p className="text-textSecondary max-w-2xl mx-auto">Built for scale, speed, and reliability. EquiCart handles millions of transactions with ease.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Cloud className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Cloud Native</h3>
              <p className="text-textSecondary">Deployed on AWS using modern containerization for infinite horizontal scaling and 99.99% uptime.</p>
            </div>

            <div className="glass-card p-8">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Microservices</h3>
              <p className="text-textSecondary">Decoupled architecture allows independent deployment of User, Product, Order, and Payment services.</p>
            </div>

            <div className="glass-card p-8">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Secure by Design</h3>
              <p className="text-textSecondary">End-to-end encryption, JWT-based authentication, and strict Role-Based Access Control (RBAC).</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
