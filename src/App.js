import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./App.css";
import Home from "./pages/Home";
import JobDetails from "./pages/JobDetails";
import Login from "./components/Login";
import { auth } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <main className="auth-shell">
        <section className="auth-card">
          <h1>Loading...</h1>
        </section>
      </main>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Router>
      <div className="app-shell">
        <header className="app-topbar">
          <div>
            <p className="app-eyebrow">Signed in</p>
            <h1 className="app-title">Smart Job Tracker</h1>
          </div>
          <div className="app-userbar">
            <span className="app-usertext">{user.displayName || user.email}</span>
            <button
              className="signout-button"
              type="button"
              onClick={() => signOut(auth)}
            >
              Sign out
            </button>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/job/:id" element={<JobDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
