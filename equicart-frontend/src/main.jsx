import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider as CognitoProvider } from "react-oidc-context";
import { AuthProvider as LocalAuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const cognitoAuthConfig = {
  authority:
    import.meta.env.VITE_COGNITO_AUTHORITY,

  client_id:
    import.meta.env.VITE_COGNITO_CLIENT_ID,

  redirect_uri:
    import.meta.env.VITE_COGNITO_REDIRECT_URI,

  response_type: "code",

  scope: "openid email phone",
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CognitoProvider {...cognitoAuthConfig}>
      <LocalAuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </LocalAuthProvider>
    </CognitoProvider>
  </React.StrictMode>,
)
