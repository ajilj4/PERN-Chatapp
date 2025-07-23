import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import RoleBasedComponent from '../auth/RoleBasedComponent';
import { PERMISSIONS, isAdmin, isPremiumUser } from '../../utils/authUtils';
import clsx from 'clsx';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    current: false,
  },
  {
    name: 'Chat',
    href: '/chat',
    icon: ChatBubbleLeftRightIcon,
    current: false,
  },
  {
    name: 'Subscription',
    href: '/subscription',
    icon: CreditCardIcon,
    current: false,
    requiresPremium: false, // Everyone can see subscription page
  },
];

const adminNavigation = [
  {
    name: 'User Management',
    href: '/admin/users',
    icon: UsersIcon,
    permission: PERMISSIONS.VIEW_USERS,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: ChartBarIcon,
    permission: PERMISSIONS.VIEW_ANALYTICS,
  },
  {
    name: 'System Settings',
    href: '/admin/settings',
    icon: Cog6ToothIcon,
    permission: PERMISSIONS.SYSTEM_SETTINGS,
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, role } = useSelector(state => state.auth);
  const { sidebarCollapsed } = useSelector(state => state.ui);

  const isCurrentPath = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const NavItem = ({ item, isAdmin = false }) => {
    const current = isCurrentPath(item.href);
    
    const baseClasses = clsx(
      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200',
      current
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
    );

    const iconClasses = clsx(
      'mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200',
      current
        ? 'text-indigo-500'
        : 'text-gray-400 group-hover:text-gray-500'
    );

    return (
      <NavLink to={item.href} className={baseClasses}>
        <item.icon className={iconClasses} />
        {!sidebarCollapsed && (
          <span className="truncate">{item.name}</span>
        )}
        {current && !sidebarCollapsed && (
          <div className="ml-auto w-2 h-2 bg-indigo-500 rounded-full" />
        )}
      </NavLink>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          {!sidebarCollapsed && (
            <div className="ml-3">
              <h1 className="text-xl font-bold text-gray-900">{import.meta.env.VITE_APP_NAME || 'ChatApp'}</h1>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map((item) => {
            // Check if user has access to this item
            if (item.requiresPremium && !isPremiumUser(role)) {
              return null;
            }

            return <NavItem key={item.name} item={item} />;
          })}
        </div>

        {/* Admin Navigation */}
        <RoleBasedComponent requiredRole="admin">
          <div className="pt-6">
            {!sidebarCollapsed && (
              <div className="px-2 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Administration
                </h3>
              </div>
            )}
            <div className="space-y-1">
              {adminNavigation.map((item) => (
                <RoleBasedComponent
                  key={item.name}
                  requiredPermission={item.permission}
                >
                  <NavItem item={item} isAdmin />
                </RoleBasedComponent>
              ))}
            </div>
          </div>
        </RoleBasedComponent>
      </nav>

      {/* User info at bottom */}
      <div className="flex-shrink-0 border-t border-gray-200 p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {(user?.username || user?.email || 'U').charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          {!sidebarCollapsed && (
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username || user?.email}
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
          )}
        </div>

        {/* Role badge */}
        {!sidebarCollapsed && (
          <div className="mt-2">
            <span className={clsx(
              'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
              isAdmin(role)
                ? 'bg-purple-100 text-purple-800'
                : isPremiumUser(role)
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            )}>
              {isAdmin(role) && <ShieldCheckIcon className="w-3 h-3 mr-1" />}
              {role === 'super_admin' ? 'Super Admin' :
               role === 'admin' ? 'Admin' :
               role === 'pro_user' ? 'Pro User' : 'User'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
