// server.js
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import morgan from 'morgan';
import 'dotenv/config';
import mongoose from 'mongoose';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import confirmEmailRoute from './routes/confirmEmailRoute.js';
import cartRouter from './routes/cartRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orders from './routes/orders.js'; // ⬅ this will receive io
import contactRoutes from './routes/contact.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true },
});

// Store seller sockets
const onlineSellers = new Map();

io.on('connection', (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("registerSeller", (sellerId) => {
    onlineSellers.set(sellerId, socket.id);
    console.log(`Seller ${sellerId} is online`);
  });

  socket.on("disconnect", () => {
    for (let [sellerId, socketId] of onlineSellers.entries()) {
      if (socketId === socket.id) {
        onlineSellers.delete(sellerId);
        console.log(`Seller ${sellerId} disconnected`);
      }
    }
  });
});

// Attach io + onlineSellers to req
app.use((req, res, next) => {
  req.io = io;
  req.onlineSellers = onlineSellers;
  next();
});

const PORT = process.env.PORT || 3000;

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], credentials: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/confirmemail', confirmEmailRoute);
app.use('/cart', cartRouter);
app.use("/products", productRoutes);
app.use('/orders', orders); // 👈 order routes will use socket
app.use("/contact", contactRoutes);

mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log('MongoDB connected!');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

app.get('/', (req, res) => {
  res.send('get api');
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
