import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// Debug MongoDB URL
console.log("MongoDB URL:", process.env.MONGODB_URL);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected!'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Schema and Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number
});
const User = mongoose.model("User", userSchema, "users");

// Default route
app.get('/', (req, res) => {
  res.send('✅ Welcome to the College API');
});

// CREATE - Add a new user (POST /users)
app.post('/users', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const newUser = new User({ name, email, age });
    await newUser.save();
    res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// READ - Get all users (GET /users)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// READ - Get a user by ID (GET /users/:id)
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// UPDATE - Update a user by ID (PUT /users/:id)
app.put('/users/:id', async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, age },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE - Remove a user by ID (DELETE /users/:id)
app.delete('/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
