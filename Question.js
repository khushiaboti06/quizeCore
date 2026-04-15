const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: function(arr) {
        return arr.length === 4;
      },
      message: 'Each question must have exactly 4 options'
    }
  },
  correctAnswer: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  category: {
    type: String,
    default: 'General'
  }
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
