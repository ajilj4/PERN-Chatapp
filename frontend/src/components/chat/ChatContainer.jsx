import { useState } from 'react';
import { useSelector } from 'react-redux';
import ContactList from './ContactList';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
// import ConversationHeader from './ConversationHeader';

export default function ChatContainer() {
  const [isMobileContactListOpen, setMobileContactListOpen] = useState(false);
  const { currentRoom } = useSelector(state => state.chat);

  return (
    <>
      {/* Mobile contact list toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-10">
        <button
          onClick={() => setMobileContactListOpen(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Contact List (Sidebar) */}
        <div className={`absolute md:relative md:block w-full md:w-80 bg-white z-20 md:z-auto transform transition-transform duration-300 ease-in-out ${isMobileContactListOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
          <ContactList onSelect={() => setMobileContactListOpen(false)} />
          <button 
            className="md:hidden absolute top-4 right-4 text-gray-500"
            onClick={() => setMobileContactListOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col md:border-l">
          {currentRoom ? (
            <>
              {/* <ConversationHeader /> */}
              <MessageList />
              <MessageInput />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center p-8">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
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