
import { useState, useEffect } from "react";
import "./App.css";
import { getRecommendations } from "./recommendations";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [message, setMessage] = useState("");
  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [skillName, setSkillName] = useState("");
  const [category, setCategory] = useState("Programming");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");
  const [saving, setSaving] = useState(false);

  const [loggedIn, setLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const recommendations = getRecommendations(skills);

  async function loadSkills() {
    setLoadingSkills(true);
    try {
      const response = await fetch("/api/skills");
      if (!response.ok) throw new Error("Unable to load skills");
      const data = await response.json();
      setSkills(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMessage("Unable to load skills. Check your backend and MySQL.");
    } finally {
      setLoadingSkills(false);
    }
  }

  useEffect(() => {
    if (loggedIn) loadSkills();
  }, [loggedIn]);

  async function handleAuth(event) {
    event.preventDefault();
    setMessage("");

    if (authMode === "signup" && username.trim().length < 2) {
      setMessage("Please enter a username with at least 2 characters.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    setAuthLoading(true);

    try {
      const response = await fetch(
        authMode === "signup" ? "/api/auth/signup" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const result = await response.text();

      if (!response.ok) {
        throw new Error(result || "Authentication failed.");
      }

      if (authMode === "signup") {
        setMessage("Account created! Please log in.");
        setAuthMode("login");
        setPassword("");
      } else {
        setLoggedIn(true);
        setUsername(username.trim() || email.split("@")[0]);
        setPassword("");
        setMessage("Welcome to SkillSphere AI!");
      }
    } catch (error) {
      setMessage(
        error.message.includes("Failed to fetch")
          ? "Cannot reach the backend. Please check Spring Boot."
          : error.message
      );
    } finally {
      setAuthLoading(false);
    }
  }

  async function checkConnection() {
    setMessage("Checking connection...");
    try {
      const response = await fetch("/api/hello");
      if (!response.ok) throw new Error();
      const data = await response.json();
      setMessage(data.message || "Backend connected successfully!");
    } catch {
      setMessage("Backend unavailable. Start Spring Boot and MySQL.");
    }
  }

  async function addSkill(event) {
    event.preventDefault();

    if (!skillName.trim()) {
      setMessage("Please enter a skill name.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: skillName.trim(),
          category,
          description: description.trim(),
          difficulty,
        }),
      });

      if (!response.ok) throw new Error("Unable to save skill");

      const savedSkill = await response.json();
      setSkills((previous) => [...previous, savedSkill]);
      setSkillName("");
      setDescription("");
      setMessage("Skill saved successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Unable to save skill. Check your backend connection.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteSkill(id) {
    if (!window.confirm("Delete this skill?")) return;

    try {
      const response = await fetch(`/api/skills/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Unable to delete skill");

      setSkills((previous) => previous.filter((skill) => skill.id !== id));
      setMessage("Skill deleted successfully!");
    } catch (error) {
      console.error(error);
      setMessage("Unable to delete skill.");
    }
  }

  function logout() {
    setLoggedIn(false);
    setActivePage("Dashboard");
    setEmail("");
    setPassword("");
    setMessage("You have logged out.");
  }

  const features = [
    {
      icon: "🎯",
      title: "Personalized Learning",
      description: "Organize your learning around your goals.",
    },
    {
      icon: "📚",
      title: "Skill Development",
      description: "Track skills, categories, and difficulty levels.",
    },
    {
      icon: "🚀",
      title: "Career Growth",
      description: "Build skills step by step for your future career.",
    },
  ];

  if (!loggedIn) {
    return (
      <div className={darkMode ? "app dark-mode auth-app" : "app auth-app"}>
        <section className="auth-card">
          <div className="brand auth-brand">
            <div className="brand-icon">S</div>
            <div>
              <h2>SkillSphere</h2>
              <span>AI Learning Platform</span>
            </div>
          </div>

          <div className="auth-heading">
            <span className="hero-tag">✨ YOUR FUTURE STARTS HERE</span>
            <h1>{authMode === "signup" ? "Create your account" : "Welcome back!"}</h1>
            <p>
              {authMode === "signup"
                ? "Start building your skills and growing your future."
                : "Sign in to continue your learning journey."}
            </p>
          </div>

          {message && <div className="message-box" role="status">{message}</div>}

          <form className="skill-form auth-form" onSubmit={handleAuth}>
            {authMode === "signup" && (
              <>
                <label htmlFor="authUsername">Username</label>
                <input
                  id="authUsername"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter your username"
                  minLength={2}
                  required
                />
              </>
            )}

            <label htmlFor="authEmail">Email address</label>
            <input
              id="authEmail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            <label htmlFor="authPassword">Password</label>
            <input
              id="authPassword"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              autoComplete={authMode === "signup" ? "new-password" : "current-password"}
              required
            />

            <button className="primary-button" type="submit" disabled={authLoading}>
              {authLoading
                ? "Please wait..."
                : authMode === "signup"
                ? "Create Account →"
                : "Log In →"}
            </button>
          </form>

          <p className="auth-switch">
            {authMode === "signup" ? "Already have an account? " : "New to SkillSphere? "}
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setAuthMode(authMode === "signup" ? "login" : "signup");
                setMessage("");
              }}
            >
              {authMode === "signup" ? "Log in" : "Sign up"}
            </button>
          </p>

          <button
            type="button"
            className="secondary-button auth-theme"
            onClick={() => setDarkMode((previous) => !previous)}
          >
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className={darkMode ? "app dark-mode" : "app"}>
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">S</div>
          <div>
            <h2>SkillSphere</h2>
            <span>AI Learning Platform</span>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>
        <nav className="sidebar-nav">
          {[
            ["Dashboard", "⌂"],
            ["My Skills", "✧"],
            ["Learning", "▤"],
            ["Profile", "◎"],
          ].map(([page, icon]) => (
            <button
              key={page}
              className={activePage === page ? "nav-item active" : "nav-item"}
              onClick={() => setActivePage(page)}
            >
              <span>{icon}</span>{page}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-icon">💡</span>
            <h3>Keep learning!</h3>
            <p>Small steps every day lead to big achievements.</p>
          </div>
          <button className="nav-item theme-button" onClick={() => setDarkMode((previous) => !previous)}>
            <span>{darkMode ? "☀️" : "🌙"}</span>{darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button className="nav-item" onClick={logout}>
            <span>↪</span> Log Out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="topbar-subtitle">YOUR PERSONAL LEARNING SPACE</p>
            <h2>{activePage}</h2>
          </div>
          <div className="topbar-right">
            <span className="status-dot" />
            <span className="status-text">{username || "SkillSphere AI"}</span>
            <div className="avatar">{(username || "S").charAt(0).toUpperCase()}</div>
          </div>
        </header>

        {message && <div className="message-box" role="status">{message}</div>}

        {activePage === "Dashboard" && (
          <>
            <section className="hero-section">
              <div className="hero-content">
                <span className="hero-tag">✨ YOUR GROWTH STARTS HERE</span>
                <h1>Learn Skills.<br />Build Your Future.</h1>
                <p>Welcome, {username}! Organize your learning, discover your strengths, and grow your career.</p>
                <button className="primary-button" onClick={() => setActivePage("My Skills")}>Explore My Skills →</button>
              </div>
              <div className="hero-illustration">
                <div className="hero-circle">
                  <span className="hero-book">📚</span>
                  <span className="floating-icon floating-one">💡</span>
                  <span className="floating-icon floating-two">🎯</span>
                  <span className="floating-icon floating-three">⭐</span>
                </div>
              </div>
            </section>

            <section className="stats-grid">
              <div className="stat-card"><div className="stat-icon purple">✧</div><div><p>Total Skills</p><h2>{skills.length}</h2></div></div>
              <div className="stat-card"><div className="stat-icon pink">📖</div><div><p>Learning Areas</p><h2>{new Set(skills.map((skill) => skill.category)).size}</h2></div></div>
              <div className="stat-card"><div className="stat-icon blue">🚀</div><div><p>Suggested Paths</p><h2>{recommendations.length}</h2></div></div>
            </section>

            <section className="section-heading"><div><h2>Explore Your Potential</h2><p>Tools to support your learning journey.</p></div></section>
            <section className="feature-grid">
              {features.map((feature) => (
                <article className="feature-card" key={feature.title}>
                  <div className="feature-icon">{feature.icon}</div><h3>{feature.title}</h3><p>{feature.description}</p>
                  <button className="text-button" onClick={() => setActivePage("My Skills")}>Get started →</button>
                </article>
              ))}
            </section>

            <section className="section-heading"><div><h2>🤖 AI Learning Recommendations</h2><p>Suggested next steps based on your saved skills.</p></div></section>
            <section className="feature-grid">
              {recommendations.map((item, index) => (
                <article className="feature-card" key={item}>
                  <div className="feature-icon">✨</div><h3>{item}</h3>
                  <p>Learning recommendation {index + 1}. Practice this topic to continue developing your skills.</p>
                  <button className="text-button" onClick={() => setActivePage("Learning")}>Explore learning →</button>
                </article>
              ))}
            </section>

            <section className="section-heading">
              <div><h2>Your Skills</h2><p>Your saved skills from the connected backend.</p></div>
              <button className="secondary-button" onClick={loadSkills} disabled={loadingSkills}>{loadingSkills ? "Loading..." : "↻ Refresh"}</button>
            </section>
            <section className="skills-list">
              {loadingSkills ? <p className="empty-state">Loading your skills...</p> :
                skills.length === 0 ? (
                  <div className="empty-state"><span>🌱</span><h3>Your journey starts here!</h3><p>Add your first skill to get started.</p><button className="primary-button" onClick={() => setActivePage("My Skills")}>Add Your First Skill</button></div>
                ) : skills.map((skill) => (
                  <article className="skill-card" key={skill.id}>
                    <div className="skill-card-icon">✧</div>
                    <div className="skill-card-info"><h3>{skill.name}</h3><p>{skill.category} · {skill.difficulty}</p>{skill.description && <p>{skill.description}</p>}</div>
                    <button className="delete-button" onClick={() => deleteSkill(skill.id)} aria-label={`Delete ${skill.name}`}>🗑️</button>
                  </article>
                ))}
            </section>
          </>
        )}

        {activePage === "My Skills" && (
          <section className="page-section">
            <div className="section-heading"><div><h2>Manage Your Skills</h2><p>Add skills and save them to MySQL.</p></div></div>
            <form className="skill-form" onSubmit={addSkill}>
              <label htmlFor="skillName">Skill Name</label>
              <input id="skillName" value={skillName} onChange={(event) => setSkillName(event.target.value)} placeholder="Example: Java, React, Python" required />
              <label htmlFor="category">Category</label>
              <select id="category" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>Programming</option><option>Web Development</option><option>Database</option><option>AI & Machine Learning</option><option>Communication</option><option>Other</option>
              </select>
              <label htmlFor="difficulty">Difficulty</label>
              <select id="difficulty" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
              <label htmlFor="description">Description</label>
              <textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What do you want to learn?" rows="4" />
              <button className="primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : "+ Add Skill"}</button>
            </form>
            <section className="section-heading"><div><h2>Saved Skills ({skills.length})</h2></div><button className="secondary-button" onClick={loadSkills}>↻ Refresh</button></section>
            <section className="skills-list">
              {skills.map((skill) => (
                <article className="skill-card" key={skill.id}>
                  <div className="skill-card-icon">✧</div><div className="skill-card-info"><h3>{skill.name}</h3><p>{skill.category} · {skill.difficulty}</p>{skill.description && <p>{skill.description}</p>}</div>
                  <button className="delete-button" onClick={() => deleteSkill(skill.id)}>🗑️</button>
                </article>
              ))}
            </section>
          </section>
        )}

        {activePage === "Learning" && (
          <section className="page-section">
            <h2>Your Learning Journey</h2><p className="page-description">Follow these suggested topics to build your knowledge.</p>
            <section className="feature-grid">
              {recommendations.map((item, index) => (
                <article className="feature-card" key={item}><div className="feature-icon">📘</div><h3>{index + 1}. {item}</h3><p>Study this topic and practise what you learn.</p></article>
              ))}
            </section>
            <button className="primary-button" onClick={() => setActivePage("My Skills")}>Manage My Skills →</button>
          </section>
        )}

        {activePage === "Profile" && (
          <section className="page-section profile-section">
            <div className="profile-avatar">{(username || "S").charAt(0).toUpperCase()}</div>
            <h2>{username}</h2><p className="page-description">{email}</p>
            <div className="stat-card profile-stat"><div className="stat-icon purple">✧</div><div><p>Skills saved</p><h2>{skills.length}</h2></div></div>
            <button className="primary-button" onClick={() => setActivePage("My Skills")}>Manage My Skills</button>
          </section>
        )}

        <footer className="footer">
          <p>© 2026 SkillSphere AI · Learn today, grow tomorrow.</p>
          <button className="secondary-button" onClick={checkConnection}>Check Backend Connection</button>
        </footer>
      </main>
    </div>
  );
}

export default App;
