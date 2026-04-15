import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

const emptyForm = { question: '', options: ['', '', '', ''], correctAnswer: 0, category: '' };

function Admin() {
  const { token } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('questions');
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [qRes, rRes] = await Promise.all([
        axios.get('/api/questions/admin', { headers }),
        axios.get('/api/results/all', { headers })
      ]);
      setQuestions(qRes.data);
      setResults(rRes.data);
    } catch (err) {
      showMsg('error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []); // eslint-disable-line

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  const handleFormChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionChange = (idx, value) => {
    const opts = [...form.options];
    opts[idx] = value;
    setForm(prev => ({ ...prev, options: opts }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmitQuestion = async (e) => {
    e.preventDefault();
    if (form.options.some(o => !o.trim())) {
      return showMsg('error', 'Please fill all 4 options');
    }
    try {
      if (editId) {
        await axios.put(`/api/questions/${editId}`, form, { headers });
        showMsg('success', 'Question updated successfully!');
      } else {
        await axios.post('/api/questions', form, { headers });
        showMsg('success', 'Question added successfully!');
      }
      resetForm();
      fetchData();
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (q) => {
    setForm({
      question: q.question,
      options: [...q.options],
      correctAnswer: q.correctAnswer,
      category: q.category || ''
    });
    setEditId(q._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/questions/${id}`, { headers });
      showMsg('success', 'Question deleted!');
      setDeleteConfirm(null);
      fetchData();
    } catch (err) {
      showMsg('error', 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header fade-in">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage questions and view quiz results</p>
          </div>
          <button className="add-btn" onClick={() => { resetForm(); setShowForm(!showForm); }}>
            {showForm ? '✕ Cancel' : '+ Add Question'}
          </button>
        </div>

        {/* Alert */}
        {msg.text && (
          <div className={`alert ${msg.type === 'error' ? 'alert-error' : 'alert-success'} fade-in`}>
            {msg.text}
          </div>
        )}

        {/* Stats Row */}
        <div className="admin-stats fade-in">
          <div className="admin-stat">
            <div className="admin-stat-num">{questions.length}</div>
            <div className="admin-stat-lbl">Total Questions</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-num">{results.length}</div>
            <div className="admin-stat-lbl">Total Attempts</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-num">
              {results.length > 0
                ? Math.round(results.reduce((a, r) => a + r.percentage, 0) / results.length)
                : 0}%
            </div>
            <div className="admin-stat-lbl">Avg. Score</div>
          </div>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <div className="question-form-card fade-in">
            <h2>{editId ? '✏️ Edit Question' : '➕ Add New Question'}</h2>
            <form onSubmit={handleSubmitQuestion} className="question-form">
              <div className="form-group">
                <label>Question *</label>
                <textarea
                  value={form.question}
                  onChange={e => handleFormChange('question', e.target.value)}
                  placeholder="Enter your question here..."
                  required
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={e => handleFormChange('category', e.target.value)}
                  placeholder="e.g. Programming, General Knowledge"
                />
              </div>

              <div className="options-grid">
                {form.options.map((opt, idx) => (
                  <div key={idx} className="form-group">
                    <label>
                      Option {String.fromCharCode(65 + idx)}
                      {form.correctAnswer === idx && <span className="correct-label"> ✓ Correct</span>}
                    </label>
                    <div className="option-input-row">
                      <input
                        type="text"
                        value={opt}
                        onChange={e => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                        required
                      />
                      <button
                        type="button"
                        className={`correct-radio ${form.correctAnswer === idx ? 'selected' : ''}`}
                        onClick={() => handleFormChange('correctAnswer', idx)}
                        title="Set as correct answer"
                      >✓</button>
                    </div>
                  </div>
                ))}
              </div>

              <p className="form-hint">💡 Click the ✓ button next to an option to mark it as the correct answer.</p>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editId ? 'Update Question' : 'Add Question'}
                </button>
                <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'questions' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            📝 Questions ({questions.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'results' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            📊 Results ({results.length})
          </button>
        </div>

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div className="questions-table-wrap fade-in">
            {questions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No questions yet. Add your first question!</p>
              </div>
            ) : (
              <div className="questions-list">
                {questions.map((q, i) => (
                  <div key={q._id} className="q-row">
                    <div className="q-info">
                      <div className="q-num">Q{i + 1}</div>
                      <div>
                        <p className="q-text">{q.question}</p>
                        <div className="q-meta">
                          <span className="q-cat">{q.category || 'General'}</span>
                          <span className="q-answer">✓ {q.options[q.correctAnswer]}</span>
                        </div>
                      </div>
                    </div>
                    <div className="q-actions">
                      <button className="edit-btn" onClick={() => handleEdit(q)}>Edit</button>
                      <button className="del-btn" onClick={() => setDeleteConfirm(q._id)}>Delete</button>
                    </div>

                    {/* Delete Confirm */}
                    {deleteConfirm === q._id && (
                      <div className="delete-confirm">
                        <p>⚠️ Are you sure you want to delete this question?</p>
                        <div className="confirm-actions">
                          <button className="del-btn" onClick={() => handleDelete(q._id)}>Yes, Delete</button>
                          <button className="cancel-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="results-table-wrap fade-in">
            {results.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <p>No quiz attempts yet.</p>
              </div>
            ) : (
              <div className="results-table">
                <div className="table-header">
                  <span>User</span>
                  <span>Score</span>
                  <span>Percentage</span>
                  <span>Date</span>
                </div>
                {results.map((r, i) => (
                  <div key={i} className="table-row">
                    <span className="user-name">👤 {r.userName}</span>
                    <span>{r.score}/{r.totalQuestions}</span>
                    <span className={`pct ${r.percentage >= 60 ? 'pct-good' : 'pct-bad'}`}>
                      {r.percentage}%
                    </span>
                    <span className="result-date">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Admin;
