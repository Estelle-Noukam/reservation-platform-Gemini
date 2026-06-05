import React, { useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { AdminPanel } from './components/AdminPanel';

const AppContent: React.FC = () => {
  const { view } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {view === 'login' && <Login />}
        {view === 'register' && <Register />}
        {view === 'dashboard' && <Dashboard />}
        {view === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
