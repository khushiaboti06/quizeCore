import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './Result.css';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state) {
    return (
      <div className="result-page">
        <div className="result-empty fade-in">
          <div className="empty-icon">🤔</div>
          <h2>No Result Found</h2>
          <p>Please take a quiz first to see your results.</p>
          <Link to="/quiz" className="result-btn">Take a Quiz</Link>
        </div>
      </div>
    );
  }

  const { score, total, percentage, results, timeTaken, autoSubmit } = state;

  const getGrade = () => {
    if (percentage >= 90) return { label: 'Excellent! 🏆', color: '#2e7d32', bg: '#e8f5e9' };
    if (percentage >= 75) return { label: 'Great Job! 🎉', color: '#1565c0', bg: '#e3f2fd' };
    if (percentage >= 60) return { label: 'Good Work! 👍', color: '#e65100', bg: '#fff3e0' };
    if (percentage >= 40) return { label: 'Keep Practicing 📚', color: '#6a1b9a', bg: '#f3e5f5' };
    return { label: 'Need More Practice 💪', color: '#c62828', bg: '#fdecea' };
  };

  const grade = getGrade();

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="result-page">
      <div className="result-container fade-in">
        {autoSubmit && (
          <div className="auto-submit-banner">⏰ Time's up! Quiz was auto-submitted.</div>
        )}

        {/* Score Card */}
        <div className="score-card">
          <div className="score-circle">
            <svg viewBox="0 0 120 120" className="score-svg">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--beige-dark)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke="var(--brown-medium)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - percentage / 100)}`}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div className="score-inner">
              <div className="score-percent">{percentage}%</div>
              <div className="score-fraction">{score}/{total}</div>
            </div>
          </div>

          <div className="score-info">
            <div className="grade-badge" style={{ color: grade.color, background: grade.bg }}>
              {grade.label}
            </div>
            <h1>Quiz Completed!</h1>
            <div className="score-stats">
              <div className="stat-box">
                <div className="stat-box-val correct">{score}</div>
                <div className="stat-box-lbl">Correct</div>
              </div>
              <div className="stat-box">
                <div className="stat-box-val wrong">{total - score}</div>
                <div className="stat-box-lbl">Wrong</div>
              </div>
              <div className="stat-box">
                <div className="stat-box-val">{timeTaken ? formatTime(timeTaken) : '—'}</div>
                <div className="stat-box-lbl">Time Taken</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="result-actions">
          <button className="result-btn" onClick={() => navigate('/quiz')}>🔄 Retake Quiz</button>
          <button className="result-btn result-btn-outline" onClick={() => navigate('/')}>🏠 Go Home</button>
        </div>

        {/* Detailed Review */}
        {results && results.length > 0 && (
          <div className="review-section">
            <h2>📋 Question Review</h2>
            <div className="review-list">
              {results.map((r, i) => (
                <div key={i} className={`review-item ${r.isCorrect ? 'correct-item' : 'wrong-item'}`}>
                  <div className="review-header">
                    <span className="review-num">Q{i + 1}</span>
                    <span className={`review-status ${r.isCorrect ? 'status-correct' : 'status-wrong'}`}>
                      {r.isCorrect ? '✓ Correct' : '✗ Wrong'}
                    </span>
                  </div>
                  <p className="review-question">{r.question}</p>
                  <div className="review-options">
                    {r.options.map((opt, idx) => (
                      <div
                        key={idx}
                        className={`review-opt
                          ${idx === r.correctAnswer ? 'opt-correct' : ''}
                          ${idx === r.userAnswer && !r.isCorrect ? 'opt-wrong' : ''}
                          ${r.userAnswer === undefined && idx === r.correctAnswer ? 'opt-correct' : ''}
                        `}
                      >
                        <span className="opt-letter">{String.fromCharCode(65 + idx)}</span>
                        <span>{opt}</span>
                        {idx === r.correctAnswer && <span className="opt-tag correct-tag">✓ Correct</span>}
                        {idx === r.userAnswer && !r.isCorrect && <span className="opt-tag wrong-tag">✗ Your answer</span>}
                      </div>
                    ))}
                  </div>
                  {r.userAnswer === undefined && (
                    <p className="skipped-note">⚠️ Question was not answered</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Result;
