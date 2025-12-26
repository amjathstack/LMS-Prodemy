import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    profileImage: { type: String },
    role: { type: String, enum: ['Learner', 'Instructor', 'none'], default: 'none' },
    title: { type: String },
    bio: { type: String },
    earnings: { type: Number, default: 0 },
})

const userModel = mongoose.models.User || mongoose.model('User', userSchema);
export default userModel;