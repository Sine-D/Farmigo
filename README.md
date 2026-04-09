# Farmigo - AgriLink Farmer Marketplace 🚜🌾

Farmigo (AgriLink) is a comprehensive digital ecosystem designed to empower farmers by connecting them directly with buyers, providing educational resources, and fostering sustainable agricultural practices. It's a high-fidelity, premium platform featuring a marketplace, learning management system, and robust administrative tools.

---

## ✨ Features

### 🛒 Marketplace & Commerce
- **Farmer Storefronts**: Farmers can list products, manage inventory, and track orders.
- **Smart Search & Filters**: Buyers can explore products by category, price, and sustainability rating.
- **Pre-order System**: Support for seasonal harvests with pre-ordering capabilities.
- **Integrated Payments**: Secure transaction processing with invoice generation.

### 🎓 Learning Management System (LMS)
- **Course Library**: Educational content tailored for modern farming techniques.
- **Progress Tracking**: Farmers can track their learning journey and earn certifications.

### 🛡️ Support & Dispute Resolution
- **Ticket System**: Real-time support tickets for user inquiries.
- **Dispute Center**: Dedicated chat-based system for resolving order issues.
- **WhatsApp Integration**: Automated notifications via Twilio for critical updates.

### 📊 Admin Command Center
- **User Management**: Approve farmers, manage roles, and monitor account status.
- **Content Moderation**: Review and approve product listings.
- **Sustainability Tracking**: Monitor and verify eco-friendly farming practices.
- **Analytics Dashboard**: Overview of platform transactions and user growth.

### 🌦️ Utility Features
- **Weather Integration**: hyper-local weather reports for farmers.
- **Certifications**: Tracking sustainable and organic certifications.

---

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Bootstrap, Framer Motion, Styled Components.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Authentication**: JWT, Google OAuth 2.0.
- **Utilities**: Twilio (WhatsApp), Axios, PDFKit (Invoices), Swagger (API Docs).

---

## 📂 Project Structure

```text
Farmigo/
├── backend/                # Express server & API
│   ├── src/
│   │   ├── config/         # Database & Cloud configurations
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & Error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API endpoint definitions
│   │   └── server.js       # Entry point
│   └── .env                # Environment variables
├── frontend/               # Vite + React App
│   ├── src/
│   │   ├── auth/           # Login & Signup modules
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Full page views
│   │   └── App.jsx         # Routing & Layout logic
│   └── tailwind.config.js  # Design system configuration
└── README.md               # Documentation
```

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local installation
- Twilio Account (for WhatsApp features - Optional)
- Weather API Key (from OpenWeatherMap)

### 1. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd Farmigo/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` root:
   ```env
   PORT=5001
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   WEATHER_API_KEY=your_weather_api_key
   
   # Twilio Config (Optional)
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   
   # Default Admin (Auto-seeded on start)
   Email=admin@farmigo.com
   Password=AdminPassword@123
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd Farmigo/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📑 API Endpoint Documentation

The API follows RESTful principles. Most protected routes require a Bearer Token in the Authorization header.

### 👤 User & Auth
- `POST /api/users` - Register a new user (Farmer/Buyer)
- `POST /api/users/login` - Authenticate user & get token
- `POST /api/users/google` - Google OAuth login
- `GET /api/users/profile` - Get current user profile (Protected)
- `PUT /api/users/profile` - Update profile (Protected)

### 📦 Products
- `GET /api/products` - List all approved products
- `GET /api/products/:id` - Get single product details
- `POST /api/products` - Create a product (Protected: Farmer)
- `PUT /api/products/:id` - Update product (Protected: Farmer/Admin)
- `DELETE /api/products/:id` - Delete product (Protected: Farmer/Admin)
- `PUT /api/products/:id/approve` - Approve listing (Protected: Admin)

### 📁 Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Protected: Admin)

### 🎫 Tickets & Support
- `GET /api/tickets` - List user tickets (Protected)
- `POST /api/tickets` - Create a support ticket (Protected)
- `GET /api/tickets/:id` - Get ticket details & messages (Protected)
- `POST /api/tickets/:id/messages` - Add message to ticket (Protected)

### 🎓 LMS (Courses)
- `GET /api/lms/courses` - List all courses
- `POST /api/lms/courses` - Create course (Protected: Admin)
- `GET /api/lms/courses/:id` - Get course details

### 💳 Orders & Payments
- `POST /api/makeOrder` - Create a new order (Protected)
- `GET /api/orders` - List user orders (Protected)
- `GET /api/orders/:id` - Get order details (Protected)
- `POST /api/payments/pay` - Process payment (Protected)
- `GET /api/invoices/:id` - Generate invoice PDF (Protected)

### 🌱 Community & Sustainability
- `GET /api/community/posts` - List community forum posts
- `POST /api/community/posts` - Create a post (Protected)
- `GET /api/sustainability/reports` - Get sustainability impact reports
- `POST /api/sustainability/certifications` - Submit certification for review (Protected: Farmer)

### 🔧 Admin Only
- `GET /api/users` - List all users
- `PUT /api/users/:id/approve` - Approve farmer account
- `PUT /api/users/:id/role` - Update user role
- `GET /api/admin/stats` - Platform analytics
- `GET /api/delivery/all` - Monitor all deliveries
