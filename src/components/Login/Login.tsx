import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./_Login.module.scss";
import { useAuth } from "../../contexts/AuthContext";

export default function Login(): JSX.Element {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (emailRef.current && passwordRef.current) {
      try {
        setError("");
        setLoading(true);
        await login(emailRef.current.value, passwordRef.current.value);
        history.push("/");
      } catch {
        setError("Failed to sign in");
      }
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Log In</h2>
        {error}
        <form className={styles.cardForm} onSubmit={handleSubmit}>
          <label className={styles.cardFormItem} htmlFor="email">
            <p>Email:</p>
            <input
              id="email"
              name="email"
              type="email"
              ref={emailRef}
              required
            />
          </label>
          <label className={styles.cardFormItem} htmlFor="password">
            <p>Password:</p>
            <input
              id="password"
              name="password"
              type="password"
              ref={passwordRef}
              required
            />
          </label>
          <button disabled={loading} className={styles.submitBtn} type="submit">
            Log In
          </button>
          <Link to="/reset-password">Forgot password?</Link>
        </form>
      </div>
      <div className={styles.bottom}>
        Need an account?
        <Link className={styles.loginLink} to="/register">
          Sign Up
        </Link>
      </div>
    </div>
  );
}
