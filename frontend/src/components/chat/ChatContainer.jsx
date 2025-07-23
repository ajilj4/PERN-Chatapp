import { useState } from 'react';
import { useSelector } from 'react-redux';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ContactList from './ContactList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ConversationHeader from './ConversationHeader';
import RoleBasedComponent from '../auth/RoleBasedComponent';
import { PERMISSIONS } from '../../utils/authUtils';

export default function ChatContainer() {
  const [isMobileContactListOpen, setMobileContactListOpen] = useState(false);
  const { currentRoom } = useSelector(state => state.chat);
  const { sidebarOpen } = useSelector(state => state.ui);

  return (
    <>
      {/* Mobile contact list toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-10">
        <button
          onClick={() => setMobileContactListOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Contact List (Sidebar) */}
        <div className={`absolute md:relative md:block w-full md:w-80 bg-white border-r border-gray-200 z-20 md:z-auto transform transition-transform duration-300 ease-in-out ${isMobileContactListOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 ${!sidebarOpen ? 'md:hidden' : ''}`}>
          <ContactList onSelect={() => setMobileContactListOpen(false)} />
          <button
            className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setMobileContactListOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {currentRoom ? (
            <>
              <ConversationHeader />
              <MessageList />
              <RoleBasedComponent requiredPermission={PERMISSIONS.SEND_MESSAGE}>
                <MessageInput />
              </RoleBasedComponent>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-8">
                <ChatBubbleLeftRightIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
                <p className="text-gray-500 max-w-md">
                  Choose from your existing conversations, start a new one, or just wait for someone to message you.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}