'use client';

import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { UserForm } from './components/UserForm';
import { UserList } from './components/UserList';
import { SearchUsers } from './components/SearchUsers';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  [key: string]: any;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'create' | 'edit'>('dashboard');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleCreateSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab('users');
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setActiveTab('edit');
    setIsSearching(false);
  };

  const handleEditSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
    setActiveTab('users');
    setSelectedUser(null);
  };

  const handleEditCancel = () => {
    setActiveTab('users');
    setSelectedUser(null);
    setIsSearching(false);
  };

  const handleSearchResults = (users: any[], searchType: string) => {
    setSearchResults(Array.isArray(users) ? users : []);
    setIsSearching(true);
    setActiveTab('users');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management System</h1>
          <p className="text-gray-600 mt-2">Create, update, and manage users with ease</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-300">
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setIsSearching(false);
            }}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'dashboard'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => {
              setActiveTab('users');
              setIsSearching(false);
            }}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'users' && !isSearching
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👥 All Users
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'create'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ➕ Create User
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {activeTab === 'dashboard' && <Dashboard />}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <SearchUsers onSearchResults={handleSearchResults} />
              {isSearching && Array.isArray(searchResults) && searchResults.length > 0 && (
                <div className="text-sm text-gray-600">
                  Found {searchResults.length} result(s)
                </div>
              )}
              {isSearching ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">City</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(searchResults) && searchResults.map((user) => (
                        <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.city}</td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <UserList onEdit={handleEditUser} refreshTrigger={refreshTrigger} />
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Create New User</h2>
              <UserForm onSuccess={handleCreateSuccess} onCancel={() => setActiveTab('dashboard')} />
            </div>
          )}

          {activeTab === 'edit' && selectedUser && (
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Edit User: {selectedUser?.firstName || ''} {selectedUser?.lastName || ''}
              </h2>
              <UserForm user={selectedUser} onSuccess={handleEditSuccess} onCancel={handleEditCancel} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

