# 🌾 AgriLink: Sustainable Farmer Marketplace & Community Ecosystem

AgriLink is a comprehensive backend solution designed to empower small-scale farmers, promote sustainable agriculture, and achieve the United Nations **Zero Hunger (SDG 2)** goal. It transcends a traditional marketplace by integrating knowledge sharing, community support, and food waste management into a single, secure API.

---

## 🚀 Key Modules & Pillars

### 🌱 1. Sustainability Management (SDG 2)
Focused on reducing food waste and improving fair distribution through responsible farming.
- **Surplus & Waste Management**: Farmers can list surplus produce with discount pricing and expiry tracking to prevent waste.
- **Zero Hunger Support**: Integrated pipeline for donating unsold produce to registered NGOs.
- **Sustainability Metrics**: Real-time dashboard tracking kilograms of food saved and families supported.
- **Green Incentives**: A gamified badge system rewarding farmers for eco-friendly practices (e.g., *Eco-Farmer*, *Zero Waste Champion*).

### 🤝 2. Community Management
Building a collaborative ecosystem for agricultural growth.
- **Farmer Community Forum**: A space for sharing tips, market trends, and peer-to-peer farming advice with moderation.
- **Resource Collaboration**: Nearby farmers can request assistance with equipment, transport, or labor.
- **Event Management**: Scheduling and registration for agricultural workshops and regional training sessions.
- **Polls & Feedback**: Gathering community insights on market demand and farming challenges.

### 📚 3. Learning Management System (LMS)
Improving farmer productivity and digital literacy.
- **Course Library**: Admin-managed educational content covering Sustainable Farming, Digital Marketing, and Financial Literacy.
- **Rich Content Support**: Modules supporting Video tutorials, PDFs, and technical articles.
- **Progress Tracking**: Real-time monitoring of course enrollment, completion status, and scores.
- **Certification**: Automated generation of digital certificates and profile badges for course graduates.

### 👤 4. Advanced User & Platform Management
- **Multi-Role RBAC**: Specialized access for **Buyers**, **Farmers**, **NGOs**, **Admins**, and **Support** teams.
- **Farmer Support**: Integrated ticketing system for onboarding and technical help.
- **Weather Awareness**: Real-time weather data integration (OpenWeather API) for situational farm planning.
- **Admin oversight**: Comprehensive dashboard for moderating listings, banning users, and platform analytics.

---

## 🛠️ Technical Architecture

### Tech Stack
- **Engine**: Node.js & Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT Authentication, Bcrypt Hashing, Role-Based Access Control (RBAC)
- **API Documentation**: Swagger UI / OpenAPI 3.0
- **Communications**: Real-time System Notifications

### Folder Structure
- `src/config`: DB connectivity and Swagger configuration.
- `src/controllers`: Business logic for Sustainability, LMS, Community, and Core modules.
- `src/middleware`: Security guards, role validation, and error handlers.
- `src/models`: Data schemas (User, Product, Course, Enrollment, Surplus, Donation, ForumPost, etc.).
- `src/routes`: Express routing organized by module.
- `src/utils`: Reusable helpers for JWT and error responses.

---

## 🏁 Installation & Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   WEATHER_API_KEY=your_openweather_key
   ```

3. **Execution**:
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

---

## 📖 API Documentation & Testing

 AgriLink uses **Swagger UI** to provide an interactive API playground. Once the server is running, visit:
`http://localhost:5000/api-docs`

---

## 🎖️ Global Impact
By leveraging AgriLink, we aim to bridge the gap between farmers and consumers, reduce the carbon footprint of food waste, and create a resilient, knowledge-driven agricultural community.
