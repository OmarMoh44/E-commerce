import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCartIcon, HeartIcon, UserIcon, MagnifyingGlassIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">E-Store</h1>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-indigo-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/products') 
                    ? 'border-indigo-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Products
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Navigation Icons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/wishlist"
                className="p-2 text-gray-400 hover:text-gray-500 relative"
              >
                <HeartIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Link>
              
              <Link
                to="/cart"
                className="p-2 text-gray-400 hover:text-gray-500 relative"
              >
                <ShoppingCartIcon className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  0
                </span>
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <UserIcon className="h-6 w-6" />
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-400 hover:text-gray-500"
                    title="Logout"
                  >
                    <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="p-2 text-gray-400 hover:text-gray-500"
                >
                  <UserIcon className="h-6 w-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 