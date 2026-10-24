
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';

const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const internships = [
  { id: 1, title: 'Frontend Developer Intern', category: 'Development', duration: '3 months', mode: 'Remote / Hybrid', description: 'Build responsive, accessible user interfaces using React, JavaScript and CSS.', skills: 'HTML, CSS, JavaScript, React' },
  { id: 2, title: 'Backend Developer Intern', category: 'Development', duration: '3 months', mode: 'Remote / Hybrid', description: 'Develop REST APIs, implement server-side logic and work with databases.', skills: 'Node.js, Express, REST APIs, MongoDB' },
  { id: 3, title: 'Full Stack Developer Intern', category: 'Development', duration: '4 months', mode: 'Hybrid', description: 'Build complete web applications connecting modern frontend and backend technologies.', skills: 'React, Node.js, Express, MongoDB' },
  { id: 4, title: 'AI/ML Intern', category: 'Artificial Intelligence', duration: '3 months', mode: 'Remote', description: 'Explore datasets, develop machine learning models and evaluate model performance.', skills: 'Python, Machine Learning, Pandas' },
  { id: 5, title: 'Data Analyst Intern', category: 'Data', duration: '2 months', mode: 'Hybrid', description: 'Analyze datasets, discover patterns and present insights using visualizations.', skills: 'Python, SQL, Excel, Data Visualization' }
];

function Header() {
  return (
    <header className="header">
      <Link to="/" className="brand">Intern<span>Connect</span></Link>
      <nav>
        <Link to="/">Internships</Link>
        <Link to="/applications">Applications</Link>
      </nav>
    </header>
  );
}

function Home() {
  const [search, setSearch] = useState('');

  const filtered = internships.filter(item =>
    `${item.title} ${item.category} ${item.skills}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <section className="hero">
        <p className="eyebrow">YOUR CAREER STARTS HERE</p>
        <h1>Find an internship.<br /><span>Build your future.</span></h1>
        <p className="hero-text">Discover opportunities, build practical skills and take your first step towards your dream career.</p>
        <a className="primary-btn" href="#internships">Explore internships ↓</a>
      </section>

      <section className="section" id="internships">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OPPORTUNITIES</p>
            <h2>Explore internships</h2>
            <p className="muted">Choose a role that matches your interests.</p>
          </div>
          <span className="count">{filtered.length} opportunities</span>
        </div>

        <input
          className="search-input"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search roles or skills..."
          aria-label="Search internships"
        />

        <div className="internship-grid">
          {filtered.map(item => (
            <article className="internship-card" key={item.id}>
              <div className="card-top">
                <span className="category">{item.category}</span>
                <span className="card-icon">↗</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="meta">
                <span>◷ {item.duration}</span>
                <span>⌖ {item.mode}</span>
              </div>
              <p className="skills"><strong>Skills:</strong> {item.skills}</p>
              <Link className="secondary-btn" to={`/internships/${item.id}`}>View details →</Link>
            </article>
          ))}
        </div>

        {filtered.length === 0 && <p className="notice">No internships match your search.</p>}
      </section>
    </>
  );
}

function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const internship = internships.find(item => item.id === Number(id));

  if (!internship) {
    return (
      <section className="section">
        <h2>Internship not found</h2>
        <Link className="secondary-btn" to="/">Back to internships</Link>
      </section>
    );
  }

  return (
    <section className="section details-section">
      <Link className="back-link" to="/">← All internships</Link>
      <div className="details-card">
        <span className="category">{internship.category}</span>
        <h1>{internship.title}</h1>
        <p>{internship.description}</p>
        <div className="detail-facts">
          <div><span>Duration</span><strong>{internship.duration}</strong></div>
          <div><span>Work mode</span><strong>{internship.mode}</strong></div>
          <div><span>Required skills</span><strong>{internship.skills}</strong></div>
        </div>
        <button className="primary-btn" onClick={() => navigate(`/apply/${internship.id}`)}>Apply for this internship →</button>
      </div>
    </section>
  );
}

function ApplicationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const internship = internships.find(item => item.id === Number(id));

  const [form, setForm] = useState({
    name: '',
    email: '',
    rollNumber: '',
    internship: internship?.title || ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(prev => ({ ...prev, internship: internship?.title || '' }));
  }, [id, internship?.title]);

  if (!internship) {
    return <section className="section"><h2>Internship not found</h2><Link to="/">Go home</Link></section>;
  }

  function updateField(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!form.name.trim() || form.name.trim().length < 2) {
      setStatus({ type: 'error', message: 'Enter your full name (at least 2 characters).' });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setStatus({ type: 'error', message: 'Enter a valid email address.' });
      return;
    }

    if (!/^[A-Za-z0-9/-]{2,30}$/.test(form.rollNumber.trim())) {
      setStatus({ type: 'error', message: 'Enter a valid roll number (2–30 letters, numbers, / or -).' });
      return;
    }

    if (!form.internship) {
      setStatus({ type: 'error', message: 'Please select an internship.' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Application submission failed.');
      }

      setStatus({
        type: 'success',
        message: `${data.message} Your application ID is ${data.application._id}.`
      });

      setForm({ name: '', email: '', rollNumber: '', internship: internship.title });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message === 'Failed to fetch'
          ? 'Cannot reach the server. Check the backend and API URL.'
          : error.message
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section form-section">
      <Link className="back-link" to={`/internships/${internship.id}`}>← Back to details</Link>
      <div className="form-card">
        <p className="eyebrow">TAKE THE NEXT STEP</p>
        <h1>Internship application</h1>
        <p className="muted">Complete your details to submit your application.</p>

        {status.message && (
          <div className={`notice ${status.type}`} role="status">
            {status.message}
            {status.type === 'success' && (
              <p><Link to="/applications">View submitted applications →</Link></p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full name</label>
          <input id="name" name="name" value={form.name} onChange={updateField} placeholder="Enter your full name" minLength="2" maxLength="100" required />

          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" required />

          <label htmlFor="rollNumber">Roll number</label>
          <input id="rollNumber" name="rollNumber" value={form.rollNumber} onChange={updateField} placeholder="Enter your roll number" pattern="[A-Za-z0-9/-]{2,30}" maxLength="30" required />

          <label htmlFor="internship">Selected internship</label>
          <select id="internship" name="internship" value={form.internship} onChange={updateField} required>
            <option value="">Choose an internship</option>
            {internships.map(item => <option key={item.id} value={item.title}>{item.title}</option>)}
          </select>

          <button className="primary-btn submit-btn" type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit application →'}
          </button>
        </form>
      </div>
    </section>
  );
}

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadApplications() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/applications`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not retrieve applications.');
      }

      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message === 'Failed to fetch'
        ? 'Cannot reach the server. Check the backend and API URL.'
        : err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">DATABASE RECORDS</p>
          <h1>Submitted applications</h1>
          <p className="muted">Applications retrieved from MongoDB through the REST API.</p>
        </div>
        <button className="secondary-btn" onClick={loadApplications}>↻ Refresh</button>
      </div>

      {loading && <p className="notice">Loading applications...</p>}
      {error && <p className="notice error">{error}</p>}
      {!loading && !error && applications.length === 0 && (
        <div className="notice">No applications found yet. <Link to="/">Explore internships</Link>.</div>
      )}

      {!loading && !error && applications.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Roll number</th><th>Internship</th><th>Submitted</th></tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app._id}>
                  <td>{app.name}</td>
                  <td>{app.email}</td>
                  <td>{app.rollNumber}</td>
                  <td>{app.internship}</td>
                  <td>{app.createdAt ? new Date(app.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="muted">Total applications: {applications.length}</p>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/internships/:id" element={<InternshipDetails />} />
            <Route path="/apply/:id" element={<ApplicationForm />} />
            <Route path="/applications" element={<Applications />} />
            <Route path="*" element={<section className="section"><h1>Page not found</h1><Link to="/">Return home</Link></section>} />
          </Routes>
        </main>
        <footer>InternConnect · Student Internship Portal</footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
