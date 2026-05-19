import React from 'react';
import AppRouter from './routes/AppRouter';
// import AppRouterV2 from './routes/AppRouterV2'; // V2: Forces login before shopping

function App() {
  return (
    <div className="min-h-screen bg-background text-textPrimary selection:bg-primary/30">
      <AppRouter />
    </div>
  );
}

export default App;
