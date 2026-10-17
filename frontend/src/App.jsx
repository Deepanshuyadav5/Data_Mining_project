import React, { useState, useEffect, useCallback } from 'react';
import {
  Brain,
  GraduationCap,
  Sparkles,
  BookOpen,
  Users,
  Activity,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  Zap,
  Award,
  Check
} from 'lucide-react';
import './App.css';

const PRESETS = {
  honor: {
    label: '🌟 Honor Student',
    data: {
      Hours_Studied: 32,
      Attendance: 96,
      Parental_Involvement: 'High',
      Access_to_Resources: 'High',
      Extracurricular_Activities: 'Yes',
      Sleep_Hours: 8,
      Previous_Scores: 88,
      Motivation_Level: 'High',
      Internet_Access: 'Yes',
      Tutoring_Sessions: 2,
      Family_Income: 'High',
      Teacher_Quality: 'High',
      School_Type: 'Private',
      Peer_Influence: 'Positive',
      Physical_Activity: 4,
      Learning_Disabilities: 'No',
      Parental_Education_Level: 'Postgraduate',
      Distance_from_Home: 'Near',
      Gender: 'Female'
    }
  },
  balanced: {
    label: '⚖️ Balanced Routine',
    data: {
      Hours_Studied: 20,
      Attendance: 85,
      Parental_Involvement: 'Medium',
      Access_to_Resources: 'Medium',
      Extracurricular_Activities: 'No',
      Sleep_Hours: 7,
      Previous_Scores: 72,
      Motivation_Level: 'Medium',
      Internet_Access: 'Yes',
      Tutoring_Sessions: 1,
      Family_Income: 'Medium',
      Teacher_Quality: 'Medium',
      School_Type: 'Public',
      Peer_Influence: 'Neutral',
      Physical_Activity: 3,
      Learning_Disabilities: 'No',
      Parental_Education_Level: 'College',
      Distance_from_Home: 'Near',
      Gender: 'Male'
    }
  },
  needs_support: {
    label: '⚠️ Academic Support',
    data: {
      Hours_Studied: 8,
      Attendance: 60,
      Parental_Involvement: 'Low',
      Access_to_Resources: 'Low',
      Extracurricular_Activities: 'No',
      Sleep_Hours: 6,
      Previous_Scores: 55,
      Motivation_Level: 'Low',
      Internet_Access: 'No',
      Tutoring_Sessions: 0,
      Family_Income: 'Low',
      Teacher_Quality: 'Low',
      School_Type: 'Public',
      Peer_Influence: 'Negative',
      Physical_Activity: 1,
      Learning_Disabilities: 'No',
      Parental_Education_Level: 'High School',
      Distance_from_Home: 'Far',
      Gender: 'Male'
    }
  },
  cramming: {
    label: '⚡ High Cramming',
    data: {
      Hours_Studied: 30,
      Attendance: 72,
      Parental_Involvement: 'Medium',
      Access_to_Resources: 'High',
      Extracurricular_Activities: 'No',
      Sleep_Hours: 5,
      Previous_Scores: 68,
      Motivation_Level: 'High',
      Internet_Access: 'Yes',
      Tutoring_Sessions: 3,
      Family_Income: 'Medium',
      Teacher_Quality: 'Medium',
      School_Type: 'Public',
      Peer_Influence: 'Neutral',
      Physical_Activity: 2,
      Learning_Disabilities: 'No',
      Parental_Education_Level: 'College',
      Distance_from_Home: 'Moderate',
      Gender: 'Female'
    }
  }
};

const DEFAULT_FORM = PRESETS.balanced.data;

export default function App() {
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState({ online: false, ping: null, checking: true });
  const [activePreset, setActivePreset] = useState('balanced');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'study', 'academic', 'family', 'lifestyle'

  // Determine workable API base URL (Vite proxy /api or direct localhost:8000)
  const checkHealth = useCallback(async () => {
    setApiStatus(prev => ({ ...prev, checking: true }));
    const startTime = performance.now();
    const candidateUrls = ['/api/health', 'http://127.0.0.1:8000/health', 'http://localhost:8000/health'];

    for (const url of candidateUrls) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(2500) });
        if (res.ok) {
          const pingTime = Math.round(performance.now() - startTime);
          setApiStatus({ online: true, ping: pingTime, checking: false });
          return;
        }
      } catch (e) {
        // continue trying
      }
    }
    setApiStatus({ online: false, ping: null, checking: false });
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 25000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' || type === 'range' ? parseFloat(value) : value
    }));
    setActivePreset(null);
  };

  const applyPreset = (key) => {
    setFormData(PRESETS[key].data);
    setActivePreset(key);
  };

  const handleRandomize = () => {
    const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
    setFormData({
      Hours_Studied: Math.floor(Math.random() * 35) + 5,
      Attendance: Math.floor(Math.random() * 40) + 60,
      Parental_Involvement: randomChoice(['Low', 'Medium', 'High']),
      Access_to_Resources: randomChoice(['Low', 'Medium', 'High']),
      Extracurricular_Activities: randomChoice(['No', 'Yes']),
      Sleep_Hours: Math.floor(Math.random() * 6) + 4,
      Previous_Scores: Math.floor(Math.random() * 50) + 50,
      Motivation_Level: randomChoice(['Low', 'Medium', 'High']),
      Internet_Access: randomChoice(['No', 'Yes']),
      Tutoring_Sessions: Math.floor(Math.random() * 6),
      Family_Income: randomChoice(['Low', 'Medium', 'High']),
      Teacher_Quality: randomChoice(['Low', 'Medium', 'High']),
      School_Type: randomChoice(['Public', 'Private']),
      Peer_Influence: randomChoice(['Negative', 'Neutral', 'Positive']),
      Physical_Activity: Math.floor(Math.random() * 8),
      Learning_Disabilities: randomChoice(['No', 'Yes']),
      Parental_Education_Level: randomChoice(['High School', 'College', 'Postgraduate']),
      Distance_from_Home: randomChoice(['Near', 'Moderate', 'Far']),
      Gender: randomChoice(['Male', 'Female'])
    });
    setActivePreset(null);
  };

  const handleReset = () => {
    setFormData(DEFAULT_FORM);
    setActivePreset('balanced');
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoints = ['/api/predict', 'http://127.0.0.1:8000/predict', 'http://localhost:8000/predict'];
    let lastError = null;

    for (const url of endpoints) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
          signal: AbortSignal.timeout(6000)
        });

        if (response.ok) {
          const data = await response.json();
          setResult(data);
          setApiStatus(prev => ({ ...prev, online: true }));
          setLoading(false);
          // Smooth scroll to result
          setTimeout(() => {
            const resultElem = document.getElementById('prediction-result-panel');
            if (resultElem) {
              resultElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }, 100);
          return;
        } else {
          const errData = await response.json().catch(() => ({}));
          lastError = errData.detail || `Server responded with ${response.status}`;
        }
      } catch (err) {
        lastError = err.message;
      }
    }

    setApiStatus(prev => ({ ...prev, online: false }));
    setError(
      lastError
        ? `Backend unreachable: ${lastError}. Make sure FastAPI is running (python app.py or uvicorn app:app --reload).`
        : 'Failed to communicate with prediction API.'
    );
    setLoading(false);
  };

  // Keyboard shortcut Ctrl/Cmd + Enter to trigger prediction
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  return (
    <div className="app-shell">
      {/* Top Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="logo-icon-wrap">
            <Brain className="logo-icon" size={24} />
          </div>
          <div>
            <div className="logo-title">EduPredict <span className="logo-badge">AI</span></div>
            <div className="logo-sub">Student Academic Performance Predictor</div>
          </div>
        </div>

        <div className="nav-meta">
          <div className={`status-pill ${apiStatus.online ? 'status-online' : 'status-offline'}`}>
            <span className="status-dot"></span>
            <span>
              {apiStatus.checking
                ? 'Checking backend...'
                : apiStatus.online
                ? `FastAPI Connected (${apiStatus.ping}ms)`
                : 'FastAPI Offline (Port 8000)'}
            </span>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={checkHealth}
            title="Refresh backend status"
          >
            <RefreshCw size={15} className={apiStatus.checking ? 'spin' : ''} />
          </button>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="hero-banner">
        <div className="hero-pill">
          <Sparkles size={14} />
          <span>Scikit-Learn ML Regression Pipeline &bull; R² = 0.7712</span>
        </div>
        <h1>Predict & Elevate Student Exam Outcomes</h1>
        <p>
          Simulate multi-dimensional academic factors, identify critical behavioral bottlenecks, and
          generate actionable performance insights powered by machine learning.
        </p>

        {/* Quick Presets Bar */}
        <div className="presets-container">
          <span className="presets-label">
            <SlidersHorizontal size={14} /> Quick Profiles:
          </span>
          <div className="presets-pills">
            {Object.entries(PRESETS).map(([key, item]) => (
              <button
                key={key}
                type="button"
                className={`preset-btn ${activePreset === key ? 'active' : ''}`}
                onClick={() => applyPreset(key)}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              className="preset-btn secondary"
              onClick={handleRandomize}
              title="Generate realistic randomized student data"
            >
              🎲 Randomize
            </button>
            <button
              type="button"
              className="preset-btn secondary"
              onClick={handleReset}
              title="Reset to default balanced profile"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </header>

      {/* Offline Alert Banner if backend is not reachable */}
      {!apiStatus.online && !apiStatus.checking && (
        <div className="alert-banner warning">
          <AlertCircle size={20} />
          <div className="alert-content">
            <strong>FastAPI Backend Offline:</strong> To get live ML predictions, start your backend server by running:
            <code>python -m uvicorn app:app --reload --port 8000</code> in your terminal.
          </div>
          <button type="button" className="btn-small-alert" onClick={checkHealth}>
            Retry Ping
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="alert-banner error">
          <AlertCircle size={20} />
          <div className="alert-content">
            <strong>Error:</strong> {error}
          </div>
        </div>
      )}

      {/* Main Interactive Form */}
      <form onSubmit={handleSubmit} className="main-form">
        <div className="form-sections-grid">

          {/* Section 1: Study & Attendance Habits */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-icon-wrap indigo">
                <BookOpen size={20} />
              </div>
              <div>
                <h2>Study & Attendance</h2>
                <p>Time management and classroom dedication</p>
              </div>
            </div>

            <div className="card-body">
              <div className="form-group">
                <div className="field-label-row">
                  <label htmlFor="Hours_Studied">Weekly Study Hours</label>
                  <span className="val-badge">{formData.Hours_Studied} hrs/wk</span>
                </div>
                <input
                  id="Hours_Studied"
                  type="range"
                  name="Hours_Studied"
                  min="0"
                  max="45"
                  step="1"
                  value={formData.Hours_Studied}
                  onChange={handleChange}
                />
                <div className="range-hints">
                  <span>0 hrs</span>
                  <span>Average: 20 hrs</span>
                  <span>45 hrs</span>
                </div>
              </div>

              <div className="form-group">
                <div className="field-label-row">
                  <label htmlFor="Attendance">Class Attendance Rate</label>
                  <span className={`val-badge ${formData.Attendance < 75 ? 'warn' : 'good'}`}>
                    {formData.Attendance}%
                  </span>
                </div>
                <input
                  id="Attendance"
                  type="range"
                  name="Attendance"
                  min="30"
                  max="100"
                  step="1"
                  value={formData.Attendance}
                  onChange={handleChange}
                />
                <div className="range-hints">
                  <span>30%</span>
                  <span>Passing: 75%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="form-group">
                <div className="field-label-row">
                  <label htmlFor="Sleep_Hours">Nightly Sleep Hours</label>
                  <span className="val-badge">{formData.Sleep_Hours} hrs/night</span>
                </div>
                <input
                  id="Sleep_Hours"
                  type="range"
                  name="Sleep_Hours"
                  min="4"
                  max="12"
                  step="1"
                  value={formData.Sleep_Hours}
                  onChange={handleChange}
                />
                <div className="range-hints">
                  <span>4h (Sleep Deprived)</span>
                  <span>Optimal: 7-8h</span>
                  <span>12h</span>
                </div>
              </div>

              <div className="form-group">
                <div className="field-label-row">
                  <label htmlFor="Tutoring_Sessions">Monthly Tutoring Sessions</label>
                  <span className="val-badge">{formData.Tutoring_Sessions} sessions</span>
                </div>
                <input
                  id="Tutoring_Sessions"
                  type="range"
                  name="Tutoring_Sessions"
                  min="0"
                  max="10"
                  step="1"
                  value={formData.Tutoring_Sessions}
                  onChange={handleChange}
                />
                <div className="range-hints">
                  <span>None</span>
                  <span>Regular: 2-3</span>
                  <span>10 / month</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Academic Background & Drive */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-icon-wrap emerald">
                <GraduationCap size={20} />
              </div>
              <div>
                <h2>Academic & Motivation</h2>
                <p>Prior performance, enthusiasm & school resources</p>
              </div>
            </div>

            <div className="card-body">
              <div className="form-group">
                <div className="field-label-row">
                  <label htmlFor="Previous_Scores">Previous Exam Score</label>
                  <span className="val-badge">{formData.Previous_Scores} / 100</span>
                </div>
                <input
                  id="Previous_Scores"
                  type="range"
                  name="Previous_Scores"
                  min="30"
                  max="100"
                  step="1"
                  value={formData.Previous_Scores}
                  onChange={handleChange}
                />
                <div className="range-hints">
                  <span>30</span>
                  <span>Benchmark: 70</span>
                  <span>100</span>
                </div>
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="Motivation_Level">
                  Motivation Level
                </label>
                <div className="radio-pill-group">
                  {['Low', 'Medium', 'High'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      className={`pill-option ${formData.Motivation_Level === lvl ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, Motivation_Level: lvl }))}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="Access_to_Resources">
                  Access to Learning Resources
                </label>
                <div className="radio-pill-group">
                  {['Low', 'Medium', 'High'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      className={`pill-option ${formData.Access_to_Resources === lvl ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, Access_to_Resources: lvl }))}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="Teacher_Quality">
                  Teacher Quality & Instruction
                </label>
                <div className="radio-pill-group">
                  {['Low', 'Medium', 'High'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      className={`pill-option ${formData.Teacher_Quality === lvl ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, Teacher_Quality: lvl }))}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Family Support & Social Environment */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-icon-wrap purple">
                <Users size={20} />
              </div>
              <div>
                <h2>Family & Socioeconomic</h2>
                <p>Support system, education background & peers</p>
              </div>
            </div>

            <div className="card-body">
              <div className="form-group">
                <label className="field-label" htmlFor="Parental_Involvement">
                  Parental Involvement
                </label>
                <div className="radio-pill-group">
                  {['Low', 'Medium', 'High'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      className={`pill-option ${formData.Parental_Involvement === lvl ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, Parental_Involvement: lvl }))}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="Parental_Education_Level">
                  Parental Education Level
                </label>
                <select
                  id="Parental_Education_Level"
                  name="Parental_Education_Level"
                  value={formData.Parental_Education_Level}
                  onChange={handleChange}
                  className="modern-select"
                >
                  <option value="High School">High School</option>
                  <option value="College">College Graduate</option>
                  <option value="Postgraduate">Postgraduate (Master's / PhD)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="Family_Income">
                  Family Income Level
                </label>
                <div className="radio-pill-group">
                  {['Low', 'Medium', 'High'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      className={`pill-option ${formData.Family_Income === lvl ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, Family_Income: lvl }))}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="Peer_Influence">
                  Peer Academic Influence
                </label>
                <div className="radio-pill-group">
                  {['Negative', 'Neutral', 'Positive'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      className={`pill-option ${formData.Peer_Influence === lvl ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, Peer_Influence: lvl }))}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Environment & Lifestyle */}
          <div className="glass-card">
            <div className="card-header">
              <div className="card-icon-wrap cyan">
                <Activity size={20} />
              </div>
              <div>
                <h2>Environment & Lifestyle</h2>
                <p>Extracurricular balance, fitness & connectivity</p>
              </div>
            </div>

            <div className="card-body">
              <div className="grid-two-cols">
                <div className="form-group">
                  <label className="field-label" htmlFor="School_Type">School Type</label>
                  <select
                    id="School_Type"
                    name="School_Type"
                    value={formData.School_Type}
                    onChange={handleChange}
                    className="modern-select"
                  >
                    <option value="Public">Public Institution</option>
                    <option value="Private">Private Institution</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label" htmlFor="Internet_Access">Home Internet</label>
                  <select
                    id="Internet_Access"
                    name="Internet_Access"
                    value={formData.Internet_Access}
                    onChange={handleChange}
                    className="modern-select"
                  >
                    <option value="Yes">Yes (High-speed)</option>
                    <option value="No">No (Offline)</option>
                  </select>
                </div>
              </div>

              <div className="grid-two-cols">
                <div className="form-group">
                  <label className="field-label" htmlFor="Extracurricular_Activities">Extracurriculars</label>
                  <select
                    id="Extracurricular_Activities"
                    name="Extracurricular_Activities"
                    value={formData.Extracurricular_Activities}
                    onChange={handleChange}
                    className="modern-select"
                  >
                    <option value="No">No Participation</option>
                    <option value="Yes">Active Participation</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label" htmlFor="Learning_Disabilities">Learning Needs</label>
                  <select
                    id="Learning_Disabilities"
                    name="Learning_Disabilities"
                    value={formData.Learning_Disabilities}
                    onChange={handleChange}
                    className="modern-select"
                  >
                    <option value="No">No Disability</option>
                    <option value="Yes">Identified Disability</option>
                  </select>
                </div>
              </div>

              <div className="grid-two-cols">
                <div className="form-group">
                  <label className="field-label" htmlFor="Distance_from_Home">Distance to School</label>
                  <select
                    id="Distance_from_Home"
                    name="Distance_from_Home"
                    value={formData.Distance_from_Home}
                    onChange={handleChange}
                    className="modern-select"
                  >
                    <option value="Near">Near (&lt; 2 km)</option>
                    <option value="Moderate">Moderate (2 - 8 km)</option>
                    <option value="Far">Far (&gt; 8 km)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="field-label" htmlFor="Gender">Student Gender</label>
                  <select
                    id="Gender"
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleChange}
                    className="modern-select"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <div className="field-label-row">
                  <label htmlFor="Physical_Activity">Physical Exercise</label>
                  <span className="val-badge">{formData.Physical_Activity} hrs/wk</span>
                </div>
                <input
                  id="Physical_Activity"
                  type="range"
                  name="Physical_Activity"
                  min="0"
                  max="12"
                  step="1"
                  value={formData.Physical_Activity}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="submit-action-bar">
          <div className="action-hint">
            <span>Tip: Press <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to predict instantly</span>
          </div>

          <button
            type="submit"
            className="btn-predict-hero"
            disabled={loading}
          >
            {loading ? (
              <>
                <RefreshCw size={20} className="spin" />
                <span>Computing AI Inference...</span>
              </>
            ) : (
              <>
                <Zap size={20} />
                <span>Calculate Predicted Score</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Prediction Result Showcase */}
      {result && (
        <section id="prediction-result-panel" className="result-showcase">
          <div className="result-header">
            <div className="result-badge">
              <Award size={16} /> ML Prediction Outcome
            </div>
            <h2>Exam Performance Assessment</h2>
            <p>Generated by our 22-feature Scikit-Learn Regression Model</p>
          </div>

          <div className="result-main-grid">
            {/* Primary Score Dial & Tier */}
            <div className="score-hero-box">
              <div className="dial-wrapper">
                <svg className="dial-svg" viewBox="0 0 160 160">
                  <circle
                    className="dial-bg-track"
                    cx="80"
                    cy="80"
                    r="68"
                  />
                  <circle
                    className={`dial-progress-track ${result.status_color || 'emerald'}`}
                    cx="80"
                    cy="80"
                    r="68"
                    strokeDasharray={427}
                    strokeDashoffset={427 - (427 * Math.min(100, Math.max(0, result.predicted_exam_score))) / 100}
                  />
                </svg>
                <div className="dial-inner-content">
                  <span className="dial-score-num">{result.predicted_exam_score}</span>
                  <span className="dial-max">/ 100</span>
                  <span className="dial-letter-grade">Grade {result.letter_grade || 'B'}</span>
                </div>
              </div>

              <div className={`performance-tier-pill tier-${result.status_color || 'emerald'}`}>
                {result.performance_category} Performance
              </div>

              <div className="percentile-metric">
                <TrendingUp size={16} />
                <span>
                  Estimated <strong>{result.percentile || 75}th Percentile</strong> among student cohort
                </span>
              </div>
            </div>

            {/* Engineered ML Feature Indexes */}
            <div className="features-deep-dive">
              <h3>Engineered Feature Indexes</h3>
              <p className="features-sub">Derived non-linear metrics that correlate directly with success</p>

              <div className="feature-metric-cards">
                <div className="engineered-card">
                  <div className="metric-meta">
                    <span className="metric-tag">Hours &times; Attendance</span>
                    <h4>Study Efficiency</h4>
                  </div>
                  <div className="metric-value">{result.engineered_metrics?.study_efficiency}</div>
                  <div className="metric-bar-bg">
                    <div
                      className="metric-bar-fill indigo"
                      style={{ width: `${Math.min(100, (result.engineered_metrics?.study_efficiency / 35) * 100)}%` }}
                    />
                  </div>
                  <span className="metric-subtext">Productive learning time coefficient</span>
                </div>

                <div className="engineered-card">
                  <div className="metric-meta">
                    <span className="metric-tag">Hours + Tutoring &times; 1.5</span>
                    <h4>Total Preparation</h4>
                  </div>
                  <div className="metric-value">{result.engineered_metrics?.total_preparation_index}</div>
                  <div className="metric-bar-bg">
                    <div
                      className="metric-bar-fill cyan"
                      style={{ width: `${Math.min(100, (result.engineered_metrics?.total_preparation_index / 40) * 100)}%` }}
                    />
                  </div>
                  <span className="metric-subtext">Combined independent & guided study</span>
                </div>

                <div className="engineered-card">
                  <div className="metric-meta">
                    <span className="metric-tag">Family + Teacher + Resources</span>
                    <h4>Support Ecosystem</h4>
                  </div>
                  <div className="metric-value">{result.engineered_metrics?.support_network_score} <span className="sub">/ 6</span></div>
                  <div className="metric-bar-bg">
                    <div
                      className="metric-bar-fill emerald"
                      style={{ width: `${Math.min(100, (result.engineered_metrics?.support_network_score / 6) * 100)}%` }}
                    />
                  </div>
                  <span className="metric-subtext">Cumulative academic support structure</span>
                </div>
              </div>

              {/* Strengths and Recommendations Grid */}
              <div className="insights-split-grid">
                {/* Strengths */}
                <div className="insights-column">
                  <h4>
                    <CheckCircle2 size={16} className="text-emerald" /> Key Identified Strengths
                  </h4>
                  <ul className="strengths-list">
                    {(result.key_strengths || []).map((strength, idx) => (
                      <li key={idx}>
                        <Check size={14} className="check-icon" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Recommendations */}
                <div className="insights-column">
                  <h4>
                    <Sparkles size={16} className="text-indigo" /> Targeted Score Boosters
                  </h4>
                  <div className="recommendations-list">
                    {(result.recommendations || []).map((rec, idx) => (
                      <div key={idx} className="recommendation-card">
                        <div className="rec-header">
                          <span className="rec-area">{rec.area}</span>
                          <span className="rec-impact">{rec.impact}</span>
                        </div>
                        <p className="rec-tip">{rec.tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer-strip">
        <p>
          Student Performance Prediction System &bull; Powered by FastAPI, React, Vite & Scikit-Learn.
        </p>
      </footer>
    </div>
  );
}
