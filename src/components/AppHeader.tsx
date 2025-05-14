'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/firebase/AuthContext';
import { useEffect, useState } from 'react';

function getInitials(email?: string) {
  if (!email) return '?';
  const name = email.split('@')[0];
  return name
    .split(/[._-]/)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}

export default function AppHeader() {
  const { user, logOut } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const hasPhoto = user && user.photoURL && user.photoURL.trim() !== '' && !imgError;

  return (
    <header className="w-full bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold text-blue-600">Jacob's Ladder</Link>
        <div className="flex items-center space-x-3 md:space-x-6">
          {mounted && user && (
            <>
              <Link href="/settings" className="text-gray-700 hover:text-blue-600 transition">Settings</Link>
              <Link href="/privacy-policy" className="text-gray-700 hover:text-blue-600 transition">Privacy Policy</Link>
              {hasPhoto ? (
                <img
                  src={user.photoURL!}
                  alt={user.displayName ? `${user.displayName}'s profile` : 'User profile'}
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300 text-gray-600 font-bold">
                  {getInitials(user.email || undefined)}
                </div>
              )}
              <span className="text-gray-700 truncate max-w-xs">{user.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
} 