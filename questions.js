const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const { auth, adminAuth } = require('../middleware/auth');

// Get all questions (for quiz - shuffled)
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.find({});
    // Shuffle questions
    const shuffled = questions.sort(() => Math.random() - 0.5);
    // Return without correct answer for quiz
    const safeQuestions = shuffled.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      category: q.category
    }));
    res.json(safeQuestions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all questions with answers (admin only)
router.get('/admin', adminAuth, async (req, res) => {
  try {
    const questions = await Question.find({});
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Submit answers and get score
router.post('/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body; // { questionId: selectedIndex }
    const questions = await Question.find({ _id: { $in: Object.keys(answers) } });

    let score = 0;
    const results = questions.map(q => {
      const userAnswer = answers[q._id.toString()];
      const isCorrect = userAnswer === q.correctAnswer;
      if (isCorrect) score++;
      return {
        questionId: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer,
        isCorrect
      };
    });

    res.json({
      score,
      total: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      results
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add question (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { question, options, correctAnswer, category } = req.body;
    if (!question || !options || options.length !== 4 || correctAnswer === undefined) {
      return res.status(400).json({ message: 'Please provide question, 4 options, and correct answer' });
    }
    const newQuestion = new Question({ question, options, correctAnswer, category: category || 'General' });
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update question (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { question, options, correctAnswer, category } = req.body;
    const updated = await Question.findByIdAndUpdate(
      req.params.id,
      { question, options, correctAnswer, category },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Question not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete question (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const deleted = await Question.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
