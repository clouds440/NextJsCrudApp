'use client';

import { useState } from 'react';
import { usersAPI } from '@/app/api/client';
import { useApi } from '@/app/utils/useApi';
import { Alert } from './Alert';

interface SearchProps {
  onSearchResults: (users: any[], searchType: string) => void;
}

export const SearchUsers = ({ onSearchResults }: SearchProps) => {
  const { loading, error, setError, executeAPI } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('general');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    let result;
    if (searchType === 'general') {
      result = await executeAPI(usersAPI.search(searchQuery));
    } else {
      result = await executeAPI(usersAPI.getByCity(searchQuery));
    }

    if (result.success) {
      const payload = result.data?.data ?? {};
      onSearchResults(Array.isArray(payload.users) ? payload.users : [], searchType);
      setSearched(true);
    }
  };

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <form onSubmit={handleSearch} className="flex gap-2">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="general">Search All Fields</option>
          <option value="city">Search by City</option>
        </select>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={searchType === 'city' ? 'Enter city name...' : 'Search by name, email, city...'}
          className="flex-1 px-3 py-2 bg-white text-gray-800 placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};
