require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Routes
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const sustainabilityRoutes = require('./routes/sustainabilityRoutes');
const communityRoutes = require('./routes/communityRoutes');
const lmsRoutes = require('./routes/lmsRoutes');
const makeOrderRoute = require('./routes/makeOrderRoute');
const paymentRoutes = require('./routes/paymentRoutes');
const disputeRoutes = require('./routes/disputeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const refundRoutes = require('./routes/refundRoutes');
const payoutRoutes = require('./routes/payoutRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Swagger
const { swaggerUi, specs } = require('./config/swagger');

const startServer = async () => {
    try {
        await connectDB();

        // ✅ Seed Admin User
        const User = require('./models/userModel');
        const adminEmail = 'admin@farmigo.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (!adminExists) {
            await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: 'AdminPassword@123',
                role: 'Admin',
                isApproved: true,
                isActive: true,
            });
            console.log('Admin user created');
        } else {
            adminExists.password = 'AdminPassword@123';
            adminExists.role = 'Admin';
            await adminExists.save();
            console.log('Admin user updated');
        }

        const app = express();

        app.use(express.json());
        app.use(cors());

        // Swagger Docs
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

        // Basic route
        app.get('/', (req, res) => {
            res.send('AgriLink API is running...');
        });

        // Routes
        app.post('/api/contact', contactRoutes);
        app.use('/api/contact', contactRoutes);
        app.use('/api/users', userRoutes);
        app.use('/api/tickets', ticketRoutes);
        app.use('/api/products', productRoutes);

        // ✅ YOUR INVENTORY (IMPORTANT)
        app.use('/api/inventory', inventoryRoutes);

        app.use('/api/orders', orderRoutes);
        app.use('/api/admin', adminRoutes);
        app.use('/api/notifications', notificationRoutes);
        app.use('/api/categories', categoryRoutes);
        app.use('/api/sustainability', sustainabilityRoutes);
        app.use('/api/community', communityRoutes);
        app.use('/api/lms', lmsRoutes);
        app.use('/api/disputes', disputeRoutes);
        app.use('/api/makeOrder', makeOrderRoute);
        app.use('/api/payments', paymentRoutes);
        app.use('/api/refunds', refundRoutes);
        app.use('/api/payouts', payoutRoutes);
        app.use('/api/invoices', invoiceRoutes);
        app.use('/api/delivery', deliveryRoutes);

        // Error Middleware
        app.use(notFound);
        app.use(errorHandler);

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });

    } catch (error) {
        console.error('Server failed to start:', error.message);
        process.exit(1);
    }
};

startServer();