import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useFileStore } from '@src/stores/fileStore';

export const Layout: React.FC = () => {
  const { reset: resetFileStore }  = useFileStore();

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Navigation Header */}
      <nav className="bg-white shadow-lg border-b border-gray-200 h-16 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-2" onClick={resetFileStore}>
                <Home className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">MIND Text Processor</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="w-full md:max-w-9/10 flex-1 overflow-auto p-6 m-auto">
        <Outlet />
      </main>
    </div>
  );
}; 