'use client';

import Link from 'next/link';

export default function GoodbyePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-white shadow rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Goodbye!</h1>
        <p className="text-gray-700 mb-6">
          Your account and all associated data have been deleted.<br />
          We're sorry to see you go. If you change your mind, you're always welcome back!
        </p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
} 