import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content fade-in">
          <div className="hero-badge">🎯 Online Quiz Platform</div>
          <h1 className="hero-title">Welcome to <span className="brand">QuizCore</span></h1>
          <p className="hero-subtitle">
            Challenge your knowledge with our interactive quiz system. 
            Answer questions, track your score, and improve your skills.
          </p>
          <div className="hero-actions">
            {user ? (
              <Link to="/quiz" className="btn btn-primary">Start Quiz Now →</Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">Get Started Free</Link>
                <Link to="/login" className="btn btn-outline">Login</Link>
              </>
            )}
          </div>
        </div>
        <div className="hero-visual fade-in">
          <div className="quiz-card-preview">
            <div className="preview-header">
              <span className="preview-badge">Question 3 of 10</span>
              <span className="preview-timer">⏱ 04:32</span>
            </div>
            <p className="preview-question">What does CSS stand for?</p>
            <div className="preview-options">
              <div className="preview-option">Computer Style Sheets</div>
              <div className="preview-option selected">Cascading Style Sheets ✓</div>
              <div className="preview-option">Creative Style Sheets</div>
              <div className="preview-option">Colorful Style Sheets</div>
            </div>
            <div className="preview-progress">
              <div className="preview-progress-bar" style={{ width: '30%' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose QuizCore?</h2>
          <p className="section-sub">Everything you need for a great quiz experience</p>
          <div className="features-grid">
            <div className="feature-card fade-in">
              <div className="feature-icon">📚</div>
              <h3>Rich Question Bank</h3>
              <p>Access hundreds of questions across multiple categories, dynamically fetched from our database.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">⏱️</div>
              <h3>Timed Challenges</h3>
              <p>Race against the clock with our built-in timer. Complete quizzes before time runs out.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">📊</div>
              <h3>Instant Results</h3>
              <p>Get your score immediately after submission with detailed question-by-question review.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">🔐</div>
              <h3>Secure & Safe</h3>
              <p>Your data is protected with JWT authentication and encrypted passwords.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">🛠️</div>
              <h3>Admin Panel</h3>
              <p>Admins can add, edit, and delete questions easily from the dashboard.</p>
            </div>
            <div className="feature-card fade-in">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Take quizzes anywhere on any device — fully responsive design.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10+</div>
              <div className="stat-label">Questions Ready</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5+</div>
              <div className="stat-label">Categories</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Free to Use</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Always Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="cta-section">
          <div className="container">
            <div className="cta-card">
              <h2>Ready to Test Your Knowledge?</h2>
              <p>Create your free account and start taking quizzes today!</p>
              <div className="cta-actions">
                <Link to="/register" className="btn btn-primary">Create Free Account</Link>
                <Link to="/login" className="btn btn-outline-dark">Already have an account?</Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <span className="footer-brand">🎯 QuizCore</span>
            <span className="footer-copy">© 2024 QuizCore. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
