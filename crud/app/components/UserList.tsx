'use client';

import { useState, useEffect } from 'react';
import { usersAPI } from '@/app/api/client';
import { useApi } from '@/app/utils/useApi';
import { Alert } from './Alert';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  isActive: boolean;
  createdAt: string;
}

interface UserListProps {
  onEdit: (user: User) => void;
  refreshTrigger: number;
}

export const UserList = ({ onEdit, refreshTrigger }: UserListProps) => {
  const { loading, error, setError, executeAPI } = useApi();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 10
  });
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [permanentlyDeleteConfirm, setPermanentlyDeleteConfirm] = useState<string | null>(null);

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


  const [selectedTab, setSelectedTab] = useState('active');

  const loadUsers = async (page = 1) => {
    const result = await executeAPI(usersAPI.getAll(page, 10));
    if (result.success) {
      const payload = result.data?.data ?? {};
      setUsers(Array.isArray(payload.users) ? payload.users : []);
      setPagination(payload.pagination ?? pagination);
    }
  };

  useEffect(() => {
    // reload users and stats when parent signals a refresh
    loadUsers();
    loadStatistics();
  }, [refreshTrigger]);

  const handleEnable = async (userId: string) => {
    const result = await executeAPI(usersAPI.enable(userId));
    if (result.success) {
      await loadUsers(pagination.currentPage);
      // refresh statistics after enabling a user
      await loadStatistics();
    }
  };

  const handleDelete = async (userId: string) => {

    const route = permanentlyDeleteConfirm ? usersAPI.permanentDelete : usersAPI.delete;
    const result = await executeAPI(route(userId));
    if (result.success) {
      setDeleteConfirm(null);
      setPermanentlyDeleteConfirm(null);
      await loadUsers(pagination.currentPage);
      // refresh statistics after delete/disable
      await loadStatistics();
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const handlePageChange = (newPage: number) => {
    loadUsers(newPage);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`${selectedTab === "inactive" ? "bg-gray-500" : "bg-blue-500"} cursor-pointer text-white p-6 rounded-lg shadow`}
          onClick={() => setSelectedTab("active")}
        >
          <h3 className="text-sm font-medium opacity-90">Active Users</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
        </div>
        <div className={`${selectedTab === "inactive" ? "bg-red-500" : "bg-gray-500"} cursor-pointer text-white p-6 rounded-lg shadow`}
          onClick={() => setSelectedTab("inactive")}
        >
          <h3 className="text-sm font-medium opacity-90">Inactive Users</h3>
          <p className="text-3xl font-bold mt-2">{stats.totalInactiveUsers}</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">City</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Created</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Loading users...
                </td>
              </tr>
            )}
            {!loading && (!Array.isArray(users) || users.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No users found. Create one to get started!
                </td>
              </tr>
            )}
            {Array.isArray(users) && users.filter(user => selectedTab === 'active' ? user.isActive : !user.isActive).map((user) => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.city}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onEdit(user)}
                      className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {if (user.isActive) {setDeleteConfirm(user._id); setPermanentlyDeleteConfirm(null)} else {handleEnable(user._id)}}}
                      className={`px-3 py-1 ${selectedTab === 'active' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white text-sm rounded transition-colors`}
                    >
                      {selectedTab === 'active' ? 'Disable User' : 'Enable User'}
                    </button>
                    <button
                      onClick={() => {
                        setPermanentlyDeleteConfirm(user._id);
                        setDeleteConfirm(user._id);
                      }}
                      className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white text-sm rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>

                  {deleteConfirm === user._id && (
                    <div
                      className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4"
                      onClick={() => setDeleteConfirm(null)}
                      role="dialog"
                      aria-modal="true"
                    >
                      <div
                        className="bg-white text-gray-500 p-6 rounded-lg shadow-lg max-w-md w-full"
                        onClick={(e) => e.stopPropagation()}
                        aria-labelledby={`confirm-delete-${user._id}`}
                      >
                        <h3 id={`confirm-delete-${user._id}`} className="text-lg font-semibold mb-2">Confirm {permanentlyDeleteConfirm ? "Permanent Delete" : "Disable User"}</h3>
                        <p className="text-gray-700 mb-4">
                          Are you sure you want to {permanentlyDeleteConfirm ? "permanently delete" : "disable"} {user.firstName} {user.lastName}?
                        </p>
                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={() => {setDeleteConfirm(null); setPermanentlyDeleteConfirm(null)}}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                          >
                            {permanentlyDeleteConfirm ? "Permanently Delete" : "Disable User"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            Showing {(pagination.currentPage - 1) * pagination.usersPerPage + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.usersPerPage, pagination.totalUsers)} of{' '}
            {pagination.totalUsers} users
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded transition-colors ${
                  page === pagination.currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 hover:bg-gray-400 text-gray-800'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
