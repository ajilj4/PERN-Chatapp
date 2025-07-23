import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms, createRoom, searchUsers, fetchContacts } from '../../features/chat/chatThunks';
import { setCurrentRoom } from '../../features/chat/chatSlice';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import { ComponentErrorBoundary } from '../ui/ErrorBoundary';
import { formatTimeAgo } from '../../utils/timeUtils';

export default function ContactList({ onSelect }) {
  const dispatch = useDispatch();
  const { rooms, loading, searchResults, contacts, searchLoading } = useSelector(state => state.chat);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    members: []
  });
  const [groupMemberSearch, setGroupMemberSearch] = useState('');

  useEffect(() => {
    dispatch(fetchRooms());
    dispatch(fetchContacts());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const debounceTimer = setTimeout(() => {
        dispatch(searchUsers(searchTerm));
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [searchTerm, dispatch]);

  useEffect(() => {
    if (groupMemberSearch.trim()) {
      const debounceTimer = setTimeout(() => {
        dispatch(searchUsers(groupMemberSearch));
      }, 300);
      return () => clearTimeout(debounceTimer);
    }
  }, [groupMemberSearch, dispatch]);

  const handleContactSelect = (contact) => {
    // Check if private room already exists
    const existingRoom = rooms.find(room =>
      room.type === 'private' &&
      room.members?.some(member => member.user?.id === contact.id)
    );

    if (existingRoom) {
      dispatch(setCurrentRoom(existingRoom));
      onSelect?.();
      return;
    }

    // Create new private room
    dispatch(createRoom({
      type: 'private',
      members: [contact.id]
    })).then((result) => {
      if (result.payload?.data) {
        dispatch(setCurrentRoom(result.payload.data));
        onSelect?.();
      }
    });
  };

  const handleGroupSubmit = () => {
    dispatch(createRoom({
      type: 'group',
      name: groupForm.name,
      description: groupForm.description,
      members: groupForm.members
    })).then((room) => {
      dispatch(setCurrentRoom(room));
      setShowCreateGroup(false);
      setGroupForm({ name: '', description: '', members: [] });
      setGroupMemberSearch('');
      onSelect();
    });
  };

  const toggleMemberSelection = (id) => {
    setGroupForm(prev => ({
      ...prev,
      members: prev.members.includes(id)
        ? prev.members.filter(memberId => memberId !== id)
        : [...prev.members, id]
    }));
  };

  // Get available users for group creation (contacts + search results)
  const getAvailableUsers = () => {
    const contactsArray = contacts || [];
    const searchArray = searchResults || [];

    // If there's a search term, prioritize search results, otherwise use contacts
    if (groupMemberSearch.trim()) {
      // Combine and deduplicate users from both sources
      const allUsers = [...contactsArray, ...searchArray];
      const uniqueUsers = allUsers.filter((user, index, self) =>
        index === self.findIndex(u => u.id === user.id)
      );

      // Filter by search term
      return uniqueUsers.filter(user =>
        user.name?.toLowerCase().includes(groupMemberSearch.toLowerCase()) ||
        user.username?.toLowerCase().includes(groupMemberSearch.toLowerCase())
      );
    }

    return contactsArray;
  };



  return (
    <ComponentErrorBoundary componentName="ContactList">
      <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Chats</h2>
          <button 
            onClick={() => setShowCreateGroup(true)}
            className="bg-blue-100 text-blue-700 p-2 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <input
          type="text"
          placeholder="Search contacts..."
          className="w-full px-4 py-2 bg-gray-100 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-y-auto flex-1">
        {/* Chat Rooms */}
        <div className="p-2">
          <h3 className="text-sm font-semibold text-gray-500 px-2 mb-1">Chats</h3>
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : (rooms || []).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No chats yet</p>
              <p className="text-xs">Search for users to start chatting</p>
            </div>
          ) : (
            (rooms || []).map(room => {
              const otherMember = room.members?.find(member => member.user?.id !== room.currentUserId);
              const displayName = room.type === 'private'
                ? otherMember?.user?.name || 'Unknown User'
                : room.name;
              const displayAvatar = room.type === 'private'
                ? otherMember?.user?.profile
                : null;
              const isOnline = room.type === 'private'
                ? otherMember?.user?.is_active
                : false;

              return (
                <div
                  key={room.id}
                  className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  onClick={() => {
                    dispatch(setCurrentRoom(room));
                    onSelect?.();
                  }}
                >
                  {room.type === 'private' ? (
                    <Avatar
                      src={displayAvatar}
                      status={isOnline ? 'online' : 'offline'}
                      name={displayName}
                    />
                  ) : (
                    <div className="relative">
                      <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                        </svg>
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{room.members?.length || 0}</span>
                      </span>
                    </div>
                  )}

                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-gray-900 truncate">{displayName}</div>
                      {room.last_activity && (
                        <span className="text-xs text-gray-500 ml-2">
                          {formatTimeAgo(room.last_activity)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {room.lastMessage?.content || (room.type === 'group' ? 'Group created' : 'Start a conversation')}
                    </p>
                  </div>

                  {room.unreadCount > 0 && (
                    <Badge count={room.unreadCount} className="ml-2" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="p-2 border-t">
            <h3 className="text-sm font-semibold text-gray-500 px-2 mb-1">Search Results</h3>
            {searchLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (searchResults || []).length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No users found</p>
              </div>
            ) : (
              (searchResults || []).map(user => (
                <div
                  key={user.id}
                  className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  onClick={() => handleContactSelect(user)}
                >
                  <Avatar
                    src={user.profile}
                    status={user.is_active ? 'online' : 'offline'}
                    name={user.name}
                  />
                  <div className="ml-3">
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Group Modal */}
      <Modal
        isOpen={showCreateGroup}
        onClose={() => {
          setShowCreateGroup(false);
          setGroupMemberSearch('');
        }}
        title="Create New Group"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg"
              value={groupForm.name}
              onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg"
              value={groupForm.description}
              onChange={(e) => setGroupForm({...groupForm, description: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Add Members</label>
            <input
              type="text"
              placeholder="Search users..."
              className="w-full px-3 py-2 border rounded-lg mb-2"
              value={groupMemberSearch}
              onChange={(e) => setGroupMemberSearch(e.target.value)}
            />
            <div className="border rounded-lg max-h-40 overflow-y-auto p-2">
              {groupMemberSearch.trim() && searchLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              ) : getAvailableUsers().length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">
                    {groupMemberSearch.trim() ? 'No users found' : 'No contacts available'}
                  </p>
                  <p className="text-xs">
                    {groupMemberSearch.trim()
                      ? 'Try a different search term'
                      : 'Start chatting with users to add them to groups'
                    }
                  </p>
                </div>
              ) : (
                getAvailableUsers().map(user => (
                <div
                  key={user.id}
                  className={`flex items-center p-2 rounded cursor-pointer ${groupForm.members.includes(user.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleMemberSelection(user.id)}
                >
                  <Avatar src={user.profile} />
                  <span className="ml-2">{user.name}</span>
                  {groupForm.members.includes(user.id) && (
                    <span className="ml-auto text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                ))
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button
              className="px-4 py-2 border rounded-lg text-gray-700"
              onClick={() => {
                setShowCreateGroup(false);
                setGroupMemberSearch('');
              }}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-300"
              onClick={handleGroupSubmit}
              disabled={!groupForm.name || groupForm.members.length < 2}
            >
              Create Group
            </button>
          </div>
        </div>
      </Modal>
      </div>
    </ComponentErrorBoundary>
  );
}