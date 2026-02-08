'use client';

import { useState, useEffect } from 'react';
import { usersAPI } from '@/app/api/client';
import { useApi } from '@/app/utils/useApi';

export const Dashboard = () => {
  const { loading, error, setError, executeAPI } = useApi();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInactiveUsers: 0,
    usersByCity: [],
    recentUsers: []
  });

  async function loadStatistics() {
    const result = await executeAPI(usersAPI.getStatistics());
    if (result.success) {
      const payload = result.data?.data ?? {};
      setStats({
        totalUsers: payload.totalUsers ?? 0,
        totalInactiveUsers: payload.totalInactiveUsers ?? 0,
        usersByCity: Array.isArray(payload.usersByCity) ? payload.usersByCity : [],
        recentUsers: Array.isArray(payload.recentUsers) ? payload.recentUsers : []
      });
    }
  }

  useEffect(() => {
    loadStatistics();
  }, []);

  const maxCityCount = Array.isArray(stats.usersByCity) && stats.usersByCity.length > 0
    ? Math.max(...stats.usersByCity.map((c: any) => c.count))
    : 1;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium opacity-90">Total Users</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium opacity-90">Inactive Users</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalInactiveUsers}</p>
        </div>
      </div>

      {/* Users by City */}
      {Array.isArray(stats.usersByCity) && stats.usersByCity.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Users by City</h3>
          <div className="space-y-3">
            {stats.usersByCity.slice(0, 5).map((city: any) => (
              <div key={city._id} className="flex items-center justify-between">
                <span className="text-gray-700">{city._id}</span>
                <div className="flex items-center gap-2">
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(city.count / maxCityCount) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-gray-600 font-medium w-8 text-right">{city.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Users */}
      {Array.isArray(stats.recentUsers) && stats.recentUsers.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Users</h3>
          <div className="space-y-2">
            {stats.recentUsers.map((user: any) => (
              <div key={user._id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-800">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
