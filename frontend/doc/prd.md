I'm building a PERN stack (PostgreSQL, Express, React, Node.js) chat application with the following requirements:

**Core Features:**
- Real-time messaging using Socket.io
- Audio calling functionality
- Video calling functionality
- User customization settings
- Stripe integration for subscription management (development mode - no real payments)

**User Roles & Permissions:**
1. **Standard User**: Basic chat functionality
2. **Pro User**: All standard features + additional premium settings/features
3. **Admin**: User management capabilities + all pro features
4. **Super Admin**: Full system administration + all admin features

**Technical Requirements:**
- Frontend: React with Redux for global state management
- Icons: Use Heroicons library exclusively
- UI: Modern, clean, and responsive design
- API Integration: RESTful APIs with proper authentication
- Real-time Communication: Socket.io integration for live chat, audio, and video calls
- Authentication: Role-based access control with JWT tokens

**Deliverables Needed:**
1. Complete frontend folder structure following React best practices
2. Redux store setup with proper slices for different features
3. Component architecture with role-based conditional rendering
4. Socket.io client integration for real-time features
5. API service layer for backend communication
6. Stripe integration components for subscription management
7. Responsive UI components using tailwind latest 4,1  approach

Please provide a professional, production-ready code structure with proper separation of concerns, error handling, and scalable architecture. 