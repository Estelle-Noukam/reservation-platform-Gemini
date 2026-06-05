import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, view, setView } = useContext(AuthContext);

  if (!user) return null;

  return (
    <nav className="bg-indigo-600 text-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <span className="font-bold text-xl tracking-tight">ReserveHub</span>
        <div className="space-x-2">
          {user.role === 'admin' && (
            <button 
              onClick={() => setView('admin')} 
              className={`px-3 py-1.5 rounded-md text-sm font-medium ${view === 'admin' ? 'bg-indigo-800' : 'hover:bg-indigo-500'}`}
            >
              Administration
            </button>
          )}
          <button 
            onClick={() => setView('dashboard')} 
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${view === 'dashboard' ? 'bg-indigo-800' : 'hover:bg-indigo-500'}`}
          >
            Réservations
          </button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium bg-indigo-700 px-3 py-1 rounded-full">{user.name} ({user.role})</span>
        <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
          Déconnexion
        </button>
      </div>
    </nav>
  );
};
