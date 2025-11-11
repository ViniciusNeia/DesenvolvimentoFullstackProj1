import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validate = () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return false;
    }
    // simple email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // mock login: accept any credentials and navigate to home
    // In a real app, call backend auth endpoint here
    navigate("/");
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>PetCare Tips</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="email">Email:</label>
          <input
            id="email"
            className={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
          />

          <label className={styles.label} htmlFor="password">Password:</label>
          <input
            id="password"
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <div className={styles.actions}>
            <button className={styles.primary} type="submit">Sign in</button>
          </div>
        </form>

        <div className={styles.footerNote}>
          <small>Don’t have an account? <a href="#">Contact the team</a></small>
        </div>
      </div>
    </div>
  );
}

export default Login;
