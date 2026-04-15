const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const { auth, adminAuth } = require('../middleware/auth');

// Save result
router.post('/', auth, async (req, res) => {
  try {
    const { score, totalQuestions, percentage, timeTaken } = req.body;
    const result = new Result({
      user: req.user.id,
      userName: req.user.name,
      score,
      totalQuestions,
      percentage,
      timeTaken: timeTaken || 0
    });
    await result.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get user's results
router.get('/my', auth, async (req, res) => {
  try {
    const results = await Result.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all results (admin)
router.get('/all', adminAuth, async (req, res) => {
  try {
    const results = await Result.find({}).sort({ createdAt: -1 }).limit(50);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
