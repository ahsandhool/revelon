import React from 'react';
import { Link } from 'react-router-dom';
import { Pick, Coins } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const Navbar = () => {
  const { isAuthenticated, isAdmin, signOut } = useAuthStore();

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Pick className="h-8 w-8" />
              <span className="text-xl font-bold">Revelon</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-1">
                  <Coins className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-indigo-200">
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-indigo-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-indigo-700 px-4 py-2 rounded hover:bg-indigo-800"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;