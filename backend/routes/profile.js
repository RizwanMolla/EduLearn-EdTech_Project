import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
const router = express.Router();

const MAX_IMAGE_LENGTH = 200 * 1024; // ~150KB binary once base64 encoded
const MAX_LEARNING_BYTES = 512 * 1024;

// Get profile
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -learning');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile image (accepts imageUrl or imageBase64)
router.put('/image', auth, async (req, res) => {
  try {
    const { imageUrl, imageBase64 } = req.body;
    let image = imageUrl;
    if (imageBase64) {
      if (!/^data:image\/(png|jpe?g|webp);base64,/.test(imageBase64)) {
        return res.status(400).json({ message: 'Unsupported image format' });
      }
      if (imageBase64.length > MAX_IMAGE_LENGTH) {
        return res.status(400).json({ message: 'Image is too large' });
      }
      image = imageBase64;
    }
    if (!image) return res.status(400).json({ message: 'Image required' });
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { image },
      { returnDocument: 'after' }
    ).select('-password -learning');
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update name and headline
router.put('/', auth, async (req, res) => {
  try {
    const { name, headline } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ message: 'Name required' });
    const update = { name: name.trim() };
    if (typeof headline === 'string') update.headline = headline.trim().slice(0, 120);
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      update,
      { returnDocument: 'after' }
    ).select('-password -learning');
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password
router.put('/password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'Both old and new passwords required' });
    if (newPassword.length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters' });
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Old password is incorrect' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add purchased course(s) to user. Accepts { courseId } or { courseIds: [] }
router.post('/purchase', auth, async (req, res) => {
  const { courseId, courseIds } = req.body;
  const ids = (Array.isArray(courseIds) ? courseIds : [courseId])
    .filter((id) => id !== undefined && id !== null && id !== '')
    .map(String);
  if (!ids.length) return res.status(400).json({ success: false, message: 'courseId required' });
  try {
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { $addToSet: { purchasedCourses: { $each: ids } } },
      { returnDocument: 'after' }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, purchasedCourses: user.purchasedCourses });
  } catch {
    res.status(500).json({ success: false, message: 'Error updating purchased courses.' });
  }
});

// Learning state sync (progress, notes, wishlist, activity)
router.get('/learning', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('learning purchasedCourses');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ learning: user.learning || {}, purchasedCourses: user.purchasedCourses });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/learning', auth, async (req, res) => {
  try {
    const { learning } = req.body;
    if (!learning || typeof learning !== 'object' || Array.isArray(learning)) {
      return res.status(400).json({ message: 'Invalid learning payload' });
    }
    if (JSON.stringify(learning).length > MAX_LEARNING_BYTES) {
      return res.status(413).json({ message: 'Learning data too large' });
    }
    await User.findByIdAndUpdate(req.user.userId, { learning });
    res.json({ success: true });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
