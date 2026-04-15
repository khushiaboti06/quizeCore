const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const resultRoutes = require('./routes/results');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizcore')
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    seedQuestions();
  })
  .catch(err => console.log('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/results', resultRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'QuizCore API is running!' });
});

// Seed default questions if none exist
async function seedQuestions() {
  const Question = require('./models/Question');
  const count = await Question.countDocuments();
  if (count === 0) {
    const defaultQuestions = [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"],
        correctAnswer: 0,
        category: "Web Development"
      },
      {
        question: "Which language is used for styling web pages?",
        options: ["HTML", "JavaScript", "CSS", "Python"],
        correctAnswer: 2,
        category: "Web Development"
      },
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Madrid", "Paris"],
        correctAnswer: 3,
        category: "General Knowledge"
      },
      {
        question: "Which data structure uses LIFO (Last In First Out)?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: 1,
        category: "Data Structures"
      },
      {
        question: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
        correctAnswer: 2,
        category: "Web Development"
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Jupiter", "Saturn", "Mars"],
        correctAnswer: 3,
        category: "General Knowledge"
      },
      {
        question: "What is the result of 2 + 2 * 2 in most programming languages?",
        options: ["8", "6", "4", "12"],
        correctAnswer: 1,
        category: "Programming"
      },
      {
        question: "Which company created JavaScript?",
        options: ["Microsoft", "Google", "Netscape", "Apple"],
        correctAnswer: 2,
        category: "Programming"
      },
      {
        question: "What does API stand for?",
        options: ["Application Programming Interface", "Applied Program Integration", "Automated Process Interface", "Application Process Interaction"],
        correctAnswer: 0,
        category: "Technology"
      },
      {
        question: "Which keyword is used to declare a variable in JavaScript?",
        options: ["var", "let", "const", "All of the above"],
        correctAnswer: 3,
        category: "JavaScript"
      }
    ];
    await Question.insertMany(defaultQuestions);
    console.log('✅ Default questions seeded');
  }
}

// Seed default admin if none exists
async function seedAdmin() {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  const adminExists = await User.findOne({ isAdmin: true });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@quizcore.com',
      password: hashedPassword,
      isAdmin: true
    });
    console.log('✅ Default admin created: admin@quizcore.com / admin123');
  }
}

mongoose.connection.once('open', () => {
  seedAdmin();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
