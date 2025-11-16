import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import styles from "./Register.module.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nome, setNome] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { register } = useAuth();

    const validate = () => {
        if (!email || !password || !nome) {
            setError("Please fill in all fields.");
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return false;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return false;
        }

        if (nome.trim().length < 2) {
            setError("Please enter a valid name.");
            return false;
        }

        setError(null);
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setError(null);
        register(email, password, nome)
            .then(() => {
                navigate("/home");
            })
            .catch(() => {
                setError("Failed to create account. Please try again.");
            });
    };

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>PetCare Tips</h1>

                {error && <div className={styles.error}>{error}</div>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.label} htmlFor="nome">Name:</label>
                    <input
                        id="nome"
                        className={styles.input}
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Your name"
                    />

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
                        <button className={styles.primary} type="submit">Create Account</button>
                    </div>
                </form>

                <div className={styles.footerNote}>
                    <small>Already have an account? <a href="/login">Sign in</a></small>
                </div>
            </div>
        </div>
    );
}

export default Register;