import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatar: { type: String }, // URL to avatar image
  role: { type: String, default: 'user' }
});

export default mongoose.model('User', UserSchema);