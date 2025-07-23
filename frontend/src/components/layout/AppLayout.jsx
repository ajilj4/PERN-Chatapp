import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import ToastContainer from '../ui/Toast';
import CallModal from '../calls/CallModal';
import IncomingCallModal from '../calls/IncomingCallModal';
import PaymentMethodModal from '../subscription/PaymentMethodModal';
import { setIsMobile, setScreenSize, setSidebarOpen } from '../../features/ui/uiSlice';

export default function AppLayout() {
  const dispatch = useDispatch();
  const { sidebarOpen, isMobile, screenSize } = useSelector(state => state.ui);

  // Handle responsive design
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      
      dispatch(setIsMobile(mobile));
      
      if (width < 640) {
        dispatch(setScreenSize('mobile'));
      } else if (width < 1024) {
        dispatch(setScreenSize('tablet'));
      } else {
        dispatch(setScreenSize('desktop'));
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isMobile ? 'w-64' : 'w-64'}
        transition-transform duration-300 ease-in-out
        ${!isMobile && !sidebarOpen ? 'w-0' : ''}
      `}>
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={() => dispatch(setSidebarOpen(false))}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      {/* Global Modals */}
      <CallModal />
      <IncomingCallModal />
      <PaymentMethodModal />
      
      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
