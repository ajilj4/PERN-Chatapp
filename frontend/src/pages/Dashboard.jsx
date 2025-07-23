import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  ChatBubbleLeftRightIcon,
  UsersIcon,
  PhoneIcon,
  VideoCameraIcon,
  PlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { fetchAllUsers } from '../features/users/usersThunks';
import { fetchUserSubscription } from '../features/subscription/subscriptionThunks';
import { fetchRooms } from '../features/chat/chatThunks';
import RoleBasedComponent from '../components/auth/RoleBasedComponent';
import { PERMISSIONS, isPremiumUser, isAdmin } from '../utils/authUtils';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Spinner } from '../components/ui/Loading';
import { formatTimeAgo } from '../utils/timeUtils';

export default function Dashboard() {
  const dispatch = useDispatch();

  const { user, role } = useSelector(state => state.auth);
  const { users, userStats } = useSelector(state => state.users);
  const { currentSubscription } = useSelector(state => state.subscription);
  const { messages, rooms } = useSelector(state => state.chat);

  useEffect(() => {
    // Fetch dashboard data
    dispatch(fetchUserSubscription());
    dispatch(fetchRooms());

    // Fetch user stats for admins
    if (isAdmin(role)) {
      dispatch(fetchAllUsers({ page: 1, limit: 5 }));
    }
  }, [dispatch, role]);

  const recentMessages = messages.slice(0, 5);
  const recentRooms = rooms.slice(0, 5);

  const stats = [
    {
      name: 'Total Messages',
      value: messages.length,
      icon: ChatBubbleLeftRightIcon,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      name: 'Active Chats',
      value: rooms.length,
      icon: UsersIcon,
      color: 'text-green-600 bg-green-100',
    },
    {
      name: 'Audio Calls',
      value: '12', // This would come from call history
      icon: PhoneIcon,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      name: 'Video Calls',
      value: '8', // This would come from call history
      icon: VideoCameraIcon,
      color: 'text-indigo-600 bg-indigo-100',
    },
  ];

  const adminStats = [
    {
      name: 'Total Users',
      value: userStats.total || 0,
      icon: UsersIcon,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      name: 'Active Users',
      value: userStats.active || 0,
      icon: UsersIcon,
      color: 'text-green-600 bg-green-100',
    },
    {
      name: 'Premium Users',
      value: userStats.premium || 0,
      icon: UsersIcon,
      color: 'text-purple-600 bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg">
        <div className="px-6 py-8 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user?.username || user?.email}!
              </h1>
              <p className="mt-2 text-indigo-100">
                {isPremiumUser(role)
                  ? 'You have access to all premium features.'
                  : 'Upgrade to Pro to unlock premium features.'}
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="flex space-x-3">
                <Link to="/chat">
                  <Button variant="secondary">
                    <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                    Start Chatting
                  </Button>
                </Link>
                {!isPremiumUser(role) && (
                  <Link to="/subscription">
                    <Button>
                      Upgrade to Pro
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Admin Stats */}
      <RoleBasedComponent requiredRole="admin">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {adminStats.map((stat) => (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </RoleBasedComponent>
    </div>
  );
}