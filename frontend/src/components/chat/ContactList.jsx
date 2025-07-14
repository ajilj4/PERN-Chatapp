import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts, fetchRooms, createRoom } from '../../features/chat/chatThunks';
import { setCurrentRoom } from '../../features/chat/chatSlice';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';

export default function ContactList({ onSelect }) {
  const dispatch = useDispatch();
  const { contacts, rooms } = useSelector(state => state.chat);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    members: []
  });

  useEffect(() => {
    dispatch(fetchContacts());
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleContactSelect = (contact) => {
    // Check if private room already exists
    const existingRoom = rooms.find(room => 
      room.type === 'private' && 
      room.members.some(member => member.user.id === contact.id)
    );
    
    if (existingRoom) {
      dispatch(setCurrentRoom(existingRoom));
      onSelect();
      return;
    }
    
    // Create new private room
    dispatch(createRoom({
      type: 'private',
      members: [contact.id]
    })).then((room) => {
      dispatch(setCurrentRoom(room));
      onSelect();
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

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
        {/* Recent Conversations */}
        <div className="p-2">
          <h3 className="text-sm font-semibold text-gray-500 px-2 mb-1">Recent</h3>
          {rooms.map(room => (
            <div 
              key={room.id}
              className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => {
                dispatch(setCurrentRoom(room));
                onSelect();
              }}
            >
              {room.type === 'private' ? (
                <>
                  <Avatar 
                    src={room.members[0].user.profile} 
                    status={room.members[0].user.is_online ? 'online' : 'offline'}
                  />
                  <div className="ml-3">
                    <div className="font-medium">{room.members[0].user.name}</div>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {room.lastMessage?.content || 'Start a conversation'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
                    <span className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="font-medium">{room.name}</div>
                    <p className="text-sm text-gray-500 truncate max-w-xs">
                      {room.lastMessage?.content || 'Group created'}
                    </p>
                  </div>
                </>
              )}
              {room.unreadCount > 0 && (
                <Badge count={room.unreadCount} className="ml-auto" />
              )}
            </div>
          ))}
        </div>

        {/* Contacts */}
        <div className="p-2 border-t">
          <h3 className="text-sm font-semibold text-gray-500 px-2 mb-1">Contacts</h3>
          {filteredContacts.map(contact => (
            <div 
              key={contact.id}
              className="flex items-center p-3 hover:bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => handleContactSelect(contact)}
            >
              <Avatar 
                src={contact.profile} 
                status={contact.is_online ? 'online' : 'offline'}
              />
              <div className="ml-3">
                <div className="font-medium">{contact.name}</div>
                <p className="text-sm text-gray-500">@{contact.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Group Modal */}
      <Modal 
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
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
            <div className="border rounded-lg max-h-40 overflow-y-auto p-2">
              {contacts.map(contact => (
                <div 
                  key={contact.id}
                  className={`flex items-center p-2 rounded cursor-pointer ${groupForm.members.includes(contact.id) ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => toggleMemberSelection(contact.id)}
                >
                  <Avatar src={contact.profile} />
                  <span className="ml-2">{contact.name}</span>
                  {groupForm.members.includes(contact.id) && (
                    <span className="ml-auto text-green-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <button
              className="px-4 py-2 border rounded-lg text-gray-700"
              onClick={() => setShowCreateGroup(false)}
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
  );
}