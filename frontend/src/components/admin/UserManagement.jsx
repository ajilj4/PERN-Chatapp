import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EllipsisVerticalIcon,
  UserIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  fetchAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser
} from '../../features/users/usersThunks';
import {
  setUserFilters,
  setUserSearchQuery,
  setPagination
} from '../../features/users/usersSlice';
import RoleBasedComponent from '../auth/RoleBasedComponent';
import { PERMISSIONS, getRoleDisplayName } from '../../utils/authUtils';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Select } from '../ui/Dropdown';
import Card from '../ui/Card';
import { Spinner } from '../ui/Loading';
import { formatTimeAgo } from '../../utils/timeUtils';
import UserActions from './UserActions';

export default function UserManagement() {
  const dispatch = useDispatch();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  const {
    users,
    loading,
    error,
    pagination,
    filters,
    searchQuery,
    userStats
  } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchAllUsers({
      page: pagination.page,
      limit: pagination.limit,
      filters,
      search: searchQuery
    }));
  }, [dispatch, pagination.page, pagination.limit, filters, searchQuery]);

  const handleSearch = (query) => {
    dispatch(setUserSearchQuery(query));
    dispatch(setPagination({ page: 1 })); // Reset to first page
  };

  const handleFilterChange = (key, value) => {
    dispatch(setUserFilters({ [key]: value }));
    dispatch(setPagination({ page: 1 })); // Reset to first page
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await dispatch(updateUserStatus({ userId, status: newStatus })).unwrap();
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setPagination({ page: newPage }));
  };

  const roleOptions = [
    { value: 'user', label: 'Standard User' },
    { value: 'pro_user', label: 'Pro User' },
    { value: 'admin', label: 'Administrator' },
    { value: 'super_admin', label: 'Super Administrator' }
  ];

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'suspended', label: 'Suspended' }
  ];

  const filterOptions = {
    role: [
      { value: 'all', label: 'All Roles' },
      ...roleOptions
    ],
    status: [
      { value: 'all', label: 'All Statuses' },
      ...statusOptions
    ],
    subscription: [
      { value: 'all', label: 'All Subscriptions' },
      { value: 'free', label: 'Free' },
      { value: 'pro', label: 'Pro' },
      { value: 'premium', label: 'Premium' }
    ]
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        
        <RoleBasedComponent requiredPermission={PERMISSIONS.MANAGE_ROLES}>
          <Button leftIcon={<PlusIcon className="w-4 h-4" />}>
            Invite User
          </Button>
        </RoleBasedComponent>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center">
            <UserIcon className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.active}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <ShieldCheckIcon className="w-8 h-8 text-purple-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Premium Users</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.premium}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Inactive Users</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.inactive}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
              containerClassName="mb-0"
            />
          </div>
          
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            leftIcon={<FunnelIcon className="w-4 h-4" />}
          >
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
            <Select
              options={filterOptions.role}
              value={filters.role}
              onChange={(value) => handleFilterChange('role', value)}
              placeholder="Filter by role"
            />
            
            <Select
              options={filterOptions.status}
              value={filters.status}
              onChange={(value) => handleFilterChange('status', value)}
              placeholder="Filter by status"
            />
            
            <Select
              options={filterOptions.subscription}
              value={filters.subscription}
              onChange={(value) => handleFilterChange('subscription', value)}
              placeholder="Filter by subscription"
            />
          </div>
        )}
      </Card>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subscription
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username || user.email}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleBasedComponent requiredPermission={PERMISSIONS.MANAGE_ROLES}>
                      <Select
                        options={roleOptions}
                        value={user.role}
                        onChange={(value) => handleRoleChange(user.id, value)}
                        className="min-w-0"
                      />
                    </RoleBasedComponent>
                    <RoleBasedComponent
                      requiredPermission={PERMISSIONS.MANAGE_ROLES}
                      inverse={true}
                    >
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getRoleDisplayName(user.role)}
                      </span>
                    </RoleBasedComponent>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : user.status === 'suspended'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastSeen ? formatTimeAgo(user.lastSeen) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.subscription?.plan || 'Free'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <UserActions
                      user={user}
                      onRoleChange={handleRoleChange}
                      onStatusChange={handleStatusChange}
                      onDelete={handleDeleteUser}
                      roleOptions={roleOptions}
                      statusOptions={statusOptions}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
