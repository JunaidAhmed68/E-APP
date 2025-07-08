import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import confirmEmailRoute from './routes/confirmEmailRoute.js';
import cartRouter from './routes/cartRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orders from './routes/orders.js';
import contactRoutes from "./routes/contact.js";
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/confirmemail', confirmEmailRoute);
app.use('/cart', cartRouter);
app.use("/products", productRoutes);
app.use('/orders', orders);
app.use("/contact", contactRoutes);

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('mongodb connected!');
}).catch((err) => {
    console.error('error in mongodb connection:', err);
});



app.get('/', (req, res) => {
    res.send('get api');
});

app.listen(PORT, () => {
    console.log(`my server is running on port: ${PORT}`);
});
