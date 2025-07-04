import React from 'react';
import { Inter } from 'next/font/google';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title = 'Wayne Enterprises Dashboard' }: DashboardLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Wayne Enterprises Business Intelligence Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img
                  className="h-8 w-auto"
                  src="/wayne-enterprises-logo.png"
                  alt="Wayne Enterprises"
                />
              </div>
              <h1 className="ml-3 text-2xl font-bold">Wayne Enterprises</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">Dashboard</a>
              <a href="#financial" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">Financial</a>
              <a href="#security" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">Security</a>
              <a href="#rd" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">R&D</a>
              <a href="#hr" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium">HR</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Wayne Enterprises. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
