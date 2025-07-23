# 🚀 PERN Chat App - Backend Integration Guide

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Redis server
- Stripe account (for payments)

## 🔧 Backend Configuration

### 1. Environment Variables Setup

Update your `backend/.env` file with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/chatapp
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=4000
NODE_ENV=development

# Email Configuration (for OTP/notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Stripe Configuration (Development Mode)
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Socket.io Configuration
SOCKET_URL=http://localhost:4000
```

### 2. Install Additional Backend Dependencies

```bash
cd backend
npm install stripe
```

### 3. Database Schema Updates

Add the following tables to your PostgreSQL database:

```sql
-- User roles and permissions
ALTER TABLE users ADD COLUMN role VARCHAR(50) DEFAULT 'user';
ALTER TABLE users ADD COLUMN permissions TEXT[];
ALTER TABLE users ADD COLUMN subscription_id VARCHAR(255);
ALTER TABLE users ADD COLUMN last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Subscription table
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    stripe_subscription_id VARCHAR(255),
    plan_id VARCHAR(100),
    plan_name VARCHAR(100),
    status VARCHAR(50),
    amount DECIMAL(10,2),
    interval VARCHAR(20),
    next_billing_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Call history table
CREATE TABLE call_history (
    id SERIAL PRIMARY KEY,
    caller_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    room_id INTEGER REFERENCES rooms(id),
    call_type VARCHAR(20), -- 'audio' or 'video'
    status VARCHAR(20), -- 'completed', 'missed', 'rejected'
    duration INTEGER, -- in seconds
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🎨 Frontend Configuration

### 1. Environment Variables Setup

Update your `frontend/.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:4000/api/v1
VITE_SOCKET_URL=http://localhost:4000

# Stripe Configuration (Development Mode)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# App Configuration
VITE_APP_NAME=Your Chat App Name
VITE_APP_VERSION=1.0.0
```

### 2. Stripe Keys Setup

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to Developers > API keys
3. Copy your **Publishable key** and **Secret key**
4. Replace the placeholder keys in both `.env` files

**⚠️ Important**: Use test keys (starting with `pk_test_` and `sk_test_`) for development!

## 🚀 Running the Application

### 1. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

The backend should start on `http://localhost:4000`

### 2. Start Frontend Development Server

```bash
cd frontend
npm install
npm run dev
```

The frontend should start on `http://localhost:5173`

## 🔐 User Roles & Permissions

The application supports 4 user roles:

1. **Standard User** (`user`)
   - Basic chat functionality
   - Audio calls only
   - Limited features

2. **Pro User** (`pro_user`)
   - All standard features
   - Video calls
   - Premium themes
   - Enhanced file sharing

3. **Admin** (`admin`)
   - All pro features
   - User management
   - Analytics access
   - Room management

4. **Super Admin** (`super_admin`)
   - Full system access
   - All permissions
   - System settings

## 🎨 Customization

### 1. Branding

Update the following files to customize your app:

- `frontend/.env` - Change `VITE_APP_NAME`
- `frontend/src/components/layout/Sidebar.jsx` - Update logo and app name
- `frontend/tailwind.config.js` - Customize colors and theme

### 2. Color Scheme

Edit `frontend/tailwind.config.js` to change the color palette:

```js
colors: {
  primary: {
    // Your primary brand colors
    500: '#your-primary-color',
    600: '#your-primary-dark',
    // ... other shades
  }
}
```

## 🧪 Testing the Integration

### 1. Authentication Flow
- Register a new user
- Login with credentials
- Test JWT token refresh

### 2. Chat Functionality
- Send messages
- Create chat rooms
- Test real-time updates

### 3. Role-Based Access
- Create users with different roles
- Test permission-based UI rendering
- Verify admin panel access

### 4. Subscription Flow (Development Mode)
- View subscription plans
- Test payment flow with Stripe test cards
- Verify subscription status updates

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure your backend CORS configuration allows your frontend URL
2. **Socket Connection Failed**: Check if Socket.io server is running and URLs match
3. **Stripe Errors**: Verify you're using test keys and they're correctly set
4. **Database Errors**: Ensure PostgreSQL is running and schema is updated

### Test Stripe Cards:

- **Success**: `4242 4242 4242 4242`
- **Declined**: `4000 0000 0000 0002`
- **Insufficient Funds**: `4000 0000 0000 9995`

Use any future expiry date and any 3-digit CVC.

## 📞 Support

If you encounter any issues during integration:

1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure all services (PostgreSQL, Redis) are running
4. Check network connectivity between frontend and backend

## 🎉 Next Steps

After successful integration:

1. **Production Setup**: Configure production environment variables
2. **SSL Certificates**: Set up HTTPS for production
3. **Database Optimization**: Add indexes and optimize queries
4. **Monitoring**: Set up error tracking and analytics
5. **Testing**: Add comprehensive test coverage
6. **Deployment**: Deploy to your preferred hosting platform

---

**🎊 Congratulations!** Your PERN stack chat application is now fully integrated and ready for development!
