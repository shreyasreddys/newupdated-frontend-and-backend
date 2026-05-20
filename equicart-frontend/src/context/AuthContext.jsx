/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useContext, useMemo } from 'react';
import { useAuth as useCognitoAuth } from 'react-oidc-context';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const cognitoAuth = useCognitoAuth();

  // Derive the user object dynamically and memoize it to prevent unnecessary effect runs
  const user = useMemo(() => {
    const profile = cognitoAuth.user?.profile;
    return cognitoAuth.isAuthenticated && profile ? {
      id: profile.sub,
      username: profile['cognito:username'] || profile.email || profile.sub,
      email: profile.email,
      name: profile.name || profile.given_name || profile.email || 'User',
      role: profile['custom:role'] || 'CUSTOMER' // default role
    } : null;
  }, [cognitoAuth.isAuthenticated, cognitoAuth.user]);

  useEffect(() => {
    if (cognitoAuth.user) {
      // Save Cognito tokens in localStorage for API requests
      if (cognitoAuth.user.id_token) {
        localStorage.setItem('token', cognitoAuth.user.id_token);
      } else if (cognitoAuth.user.access_token) {
        localStorage.setItem('token', cognitoAuth.user.access_token);
      }

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
    } else {
      if (!cognitoAuth.isLoading) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [cognitoAuth.user, cognitoAuth.isLoading, user]);

  const login = () => {
    cognitoAuth.signinRedirect();
  };

  const logout = () => {
    // Standard Cognito signout flow
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
    const logoutUri = import.meta.env.VITE_COGNITO_LOGOUT_URI;
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;

    // Clear tokens
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    cognitoAuth.removeUser();

    // Redirect to federated logout
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading: cognitoAuth.isLoading,
      isLoading: cognitoAuth.isLoading,
      isAuthenticated: cognitoAuth.isAuthenticated,
      error: cognitoAuth.error,
      signinRedirect: () => cognitoAuth.signinRedirect(),
      signoutRedirect: logout,
      removeUser: () => cognitoAuth.removeUser(),
      cognitoAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
