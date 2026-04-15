import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Quiz.css';

const QUIZ_DURATION = 10 * 60; // 10 minutes in seconds

function Quiz() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get('/api/questions', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(res.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load questions. Please try again.');
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [token]);

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const timeTaken = QUIZ_DURATION - timeLeft;
      const res = await axios.post('/api/questions/submit', { answers }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Save result
      await axios.post('/api/results', {
        score: res.data.score,
        totalQuestions: res.data.total,
        percentage: res.data.percentage,
        timeTaken
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/result', {
        state: {
          score: res.data.score,
          total: res.data.total,
          percentage: res.data.percentage,
          results: res.data.results,
          timeTaken,
          autoSubmit
        }
      });
    } catch (err) {
      setError('Submission failed. Please try again.');
      setSubmitting(false);
    }
  }, [answers, token, timeLeft, navigate, submitting]);

  // Timer
  useEffect(() => {
    if (!quizStarted || loading) return;
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [quizStarted, loading, timeLeft, handleSubmit]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleNext = () => {
    if (current < questions.length - 1) setCurrent(prev => prev + 1);
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(prev => prev - 1);
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? ((current + 1) / questions.length) * 100 : 0;
  const isTimeLow = timeLeft < 60;

  if (loading) {
    return (
      <div className="quiz-page">
        <div className="spinner-overlay">
          <div>
            <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
            <p style={{ color: 'var(--brown-lighter)', textAlign: 'center' }}>Loading questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-page">
        <div className="quiz-error">
          <div className="error-icon">⚠️</div>
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button className="quiz-btn" onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="quiz-page">
        <div className="quiz-start-card fade-in">
          <div className="start-icon">🎯</div>
          <h1>Ready to Begin?</h1>
          <p>Welcome, <strong>{user?.name}</strong>! Your quiz is ready.</p>

          <div className="quiz-info-grid">
            <div className="quiz-info-item">
              <span className="info-icon">📝</span>
              <span className="info-label">Questions</span>
              <span className="info-value">{questions.length}</span>
            </div>
            <div className="quiz-info-item">
              <span className="info-icon">⏱️</span>
              <span className="info-label">Time Limit</span>
              <span className="info-value">10 Min</span>
            </div>
            <div className="quiz-info-item">
              <span className="info-icon">🎯</span>
              <span className="info-label">Type</span>
              <span className="info-value">MCQ</span>
            </div>
          </div>

          <ul className="quiz-rules">
            <li>✅ Each question has 4 options — choose the best one</li>
            <li>✅ You can navigate between questions freely</li>
            <li>✅ Submit when you're done or time runs out</li>
            <li>✅ Results are shown instantly after submission</li>
          </ul>

          <button className="quiz-btn quiz-btn-start" onClick={() => setQuizStarted(true)}>
            Start Quiz Now 🚀
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="quiz-page">
      <div className="quiz-wrapper fade-in">
        {/* Top Bar */}
        <div className="quiz-topbar">
          <div className="quiz-progress-label">
            Question <strong>{current + 1}</strong> of <strong>{questions.length}</strong>
          </div>
          <div className="quiz-answered">
            ✅ {answeredCount}/{questions.length} answered
          </div>
          <div className={`quiz-timer ${isTimeLow ? 'timer-low' : ''}`}>
            ⏱ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="quiz-progress-bar-wrap">
          <div className="quiz-progress-bar-fill" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Question Card */}
        <div className="question-card">
          <div className="question-number">Q{current + 1}</div>
          <h2 className="question-text">{q.question}</h2>
          {q.category && <span className="question-category">{q.category}</span>}

          <div className="options-list">
            {q.options.map((option, idx) => (
              <button
                key={idx}
                className={`option-btn ${answers[q._id] === idx ? 'selected' : ''}`}
                onClick={() => handleSelect(q._id, idx)}
              >
                <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                <span className="option-text">{option}</span>
                {answers[q._id] === idx && <span className="option-check">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="quiz-nav">
          <button
            className="quiz-btn quiz-btn-secondary"
            onClick={handlePrev}
            disabled={current === 0}
          >
            ← Previous
          </button>

          <div className="dot-nav">
            {questions.map((_, i) => (
              <button
                key={i}
                className={`dot ${i === current ? 'dot-active' : ''} ${answers[questions[i]._id] !== undefined ? 'dot-answered' : ''}`}
                onClick={() => setCurrent(i)}
                title={`Question ${i + 1}`}
              ></button>
            ))}
          </div>

          {current < questions.length - 1 ? (
            <button className="quiz-btn" onClick={handleNext}>Next →</button>
          ) : (
            <button
              className="quiz-btn quiz-btn-submit"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
            >
              {submitting ? <span className="btn-spinner"></span> : 'Submit Quiz 🎯'}
            </button>
          )}
        </div>

        {error && <div className="alert alert-error" style={{ marginTop: '16px' }}>{error}</div>}
      </div>
    </div>
  );
}

export default Quiz;
