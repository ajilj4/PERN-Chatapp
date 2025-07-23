import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { toggleSidebar, openModal } from '../../features/ui/uiSlice';
import { logoutUser } from '../../features/auth/authThunks';
import Dropdown, { DropdownItem, DropdownDivider } from '../ui/Dropdown';
import Button from '../ui/Button';
import { getRoleDisplayName } from '../../utils/authUtils';

export default function Header() {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, role } = useSelector(state => state.auth);
  const { notifications, connectionStatus } = useSelector(state => state.ui);
  const { sidebarOpen, isMobile } = useSelector(state => state.ui);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search:', searchQuery);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'bg-green-400';
      case 'connecting':
        return 'bg-yellow-400';
      case 'disconnected':
        return 'bg-red-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          {/* Sidebar toggle */}
          <button
            onClick={handleToggleSidebar}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Search bar - hidden on mobile */}
          {!isMobile && (
            <form onSubmit={handleSearch} className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search conversations, users..."
                />
              </div>
            </form>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Connection status */}
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor()}`} />
            <span className="text-xs text-gray-500 hidden sm:inline">
              {connectionStatus}
            </span>
          </div>

          {/* Search button - mobile only */}
          {isMobile && (
            <button
              onClick={() => dispatch(openModal('search'))}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>
          )}

          {/* Notifications */}
          <Dropdown
            trigger={
              <button className="relative p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <BellIcon className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </span>
                )}
              </button>
            }
            placement="bottom-end"
            menuClassName="w-80"
          >
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <DropdownItem
                    key={notification.id}
                    className={`px-4 py-3 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-2" />
                      )}
                    </div>
                  </DropdownItem>
                ))
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200">
                <Button variant="ghost" size="sm" fullWidth>
                  View all notifications
                </Button>
              </div>
            )}
          </Dropdown>

          {/* User menu */}
          <Dropdown
            trigger={
              <button className="flex items-center space-x-2 p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                <UserCircleIcon className="h-8 w-8" />
                {!isMobile && (
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.username || user?.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getRoleDisplayName(role)}
                    </p>
                  </div>
                )}
              </button>
            }
            placement="bottom-end"
          >
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">
                {user?.username || user?.email}
              </p>
              <p className="text-xs text-gray-500">
                {getRoleDisplayName(role)}
              </p>
            </div>

            <DropdownItem onClick={() => dispatch(openModal('profile'))}>
              <UserCircleIcon className="w-4 h-4 mr-2" />
              Profile
            </DropdownItem>

            <DropdownItem onClick={() => dispatch(openModal('settings'))}>
              <Cog6ToothIcon className="w-4 h-4 mr-2" />
              Settings
            </DropdownItem>

            <DropdownDivider />

            <DropdownItem danger onClick={handleLogout}>
              <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
              Sign out
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
