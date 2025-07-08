import mongoose from "mongoose";

let userSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    age: {type: Number, required: true},
    password: {type: String, required: true},
    isEmailVerified: {type: Boolean, default: false},
    myCart: {type: Array, default: []},
    myOrders: {type: Array, default: []},
}, { timestamps: true });

let User = mongoose.model('E_Users', userSchema);

export default User;