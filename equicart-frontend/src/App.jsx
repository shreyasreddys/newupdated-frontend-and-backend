import { useAuth } from './context/AuthContext';
import { Package, Lock, ArrowRight, AlertTriangle } from 'lucide-react';
import AppRouter from './routes/AppRouter';
// import AppRouterV2 from './routes/AppRouterV2'; // V2: Forces login before shopping
import Spinner from './components/ui/Spinner';

function App() {
  const auth = useAuth();

  // eslint-disable-next-line no-unused-vars
  const signOutRedirect = () => {
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;

    const logoutUri = import.meta.env.VITE_COGNITO_LOGOUT_URI;

    const cognitoDomain =
      import.meta.env.VITE_COGNITO_DOMAIN;

    window.location.href =
      `${cognitoDomain}/logout?client_id=${clientId}` +
      `&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden text-textPrimary">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="flex flex-col items-center gap-4 relative z-10">
          <Spinner size="lg" color="primary" />
          <p className="text-textSecondary text-sm font-medium tracking-wide animate-pulse">
            Authenticating with Cognito...
          </p>
        </div>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden text-textPrimary">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-danger/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="w-full max-w-md glass-card p-8 md:p-10 text-center relative z-10 border border-white/5 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-danger/10 text-danger mb-4 border border-danger/20">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
              Authentication Error
            </h2>
            <p className="text-textSecondary text-sm">
              An error occurred during Cognito authentication.
            </p>
          </div>
          <div className="bg-danger/5 border border-danger/10 rounded-xl p-4 mb-6 text-sm text-danger/90 font-mono text-left break-all">
            {auth.error.message}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-secondary hover:bg-neutral-800 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 cursor-pointer"
          >
            Retry Login
          </button>
        </div>
      </div>
    );
  }

  if (auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-textPrimary selection:bg-primary/30">
        <AppRouter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden text-textPrimary">
      {/* Decorative gradient glowing backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand logo at the top left */}
      <div className="absolute top-8 left-8 flex items-center gap-2 text-2xl font-bold text-white tracking-tight">
        <Package className="text-primary" size={32} />
        <span>Equi<span className="text-primary">Cart</span></span>
      </div>

      <div className="w-full max-w-md glass-card p-8 md:p-10 text-center relative z-10 border border-white/5 bg-surface/80 backdrop-blur-xl rounded-2xl shadow-2xl">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4 border border-primary/20 animate-pulse">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
            Secure Authentication
          </h2>
          <p className="text-textSecondary text-sm">
            Sign in using AWS Cognito to access your EquiCart account.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => auth.signinRedirect()}
            className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Sign In with Cognito</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="text-xs text-textSecondary pt-4 border-t border-white/5 flex items-center justify-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-success animate-ping"></span>
            <span>Enterprise Identity Provider Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
