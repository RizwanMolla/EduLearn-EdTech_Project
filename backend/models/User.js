import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  image: { type: String, default: '' }, // profile image URL or base64 data URL
  headline: { type: String, default: '', maxlength: 120 },
  // Course ids from the frontend catalog (e.g. "1", "web-development-bootcamp")
  purchasedCourses: [{ type: String }],
  // Serialized learning state (progress, notes, wishlist, activity) synced from the client
  learning: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true, minimize: false });

export default mongoose.model('User', userSchema);
