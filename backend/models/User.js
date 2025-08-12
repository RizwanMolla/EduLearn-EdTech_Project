import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, default: '' }, // profile image URL
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

export default mongoose.model('User', userSchema);
