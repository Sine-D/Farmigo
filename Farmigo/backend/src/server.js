require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const sustainabilityRoutes = require('./routes/sustainabilityRoutes');
const communityRoutes = require('./routes/communityRoutes');
const lmsRoutes = require('./routes/lmsRoutes');

const { swaggerUi, specs } = require('./config/swagger');

const startServer = async () => {
    try {
        await connectDB();

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
        app.use('/api/users', userRoutes);
        app.use('/api/tickets', ticketRoutes);
        app.use('/api/products', productRoutes);
        app.use('/api/admin', adminRoutes);
        app.use('/api/notifications', notificationRoutes);
        app.use('/api/categories', categoryRoutes);
        app.use('/api/sustainability', sustainabilityRoutes);
        app.use('/api/community', communityRoutes);
        app.use('/api/lms', lmsRoutes);

        // Error Middleware
        app.use(notFound);
        app.use(errorHandler);

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        });
    } catch (error) {
        console.error(`Error starting server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
