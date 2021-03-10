import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "@contexts/index";
import {
  HOME_ROUTE,
  REGISTER_ROUTE,
  RESET_PASSWORD_ROUTE,
} from "@constants/routes";
import styles from "./_Login.module.scss";

export default function Login(): JSX.Element {
  const emailRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const passwordRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const { login } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      setLoading(false);
      history.push(HOME_ROUTE);
    } catch {
      setLoading(false);
      setError("Failed to sign in");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Log In</h2>
        {error}
        <form className={styles.cardForm} onSubmit={handleSubmit}>
          <label className="c-input" htmlFor="email">
            <p>Email:</p>
            <input
              id="email"
              name="email"
              type="email"
              ref={emailRef}
              required
            />
          </label>
          <label className="c-input" htmlFor="password">
            <p>Password:</p>
            <input
              id="password"
              name="password"
              type="password"
              ref={passwordRef}
              required
            />
          </label>
          <button disabled={loading} className="c-btn-blue" type="submit">
            Log In
          </button>
          <Link to={RESET_PASSWORD_ROUTE}>Forgot password?</Link>
        </form>
      </div>
      <div className={styles.bottom}>
        Need an account?
        <Link className={styles.loginLink} to={REGISTER_ROUTE}>
          Sign Up
        </Link>
      </div>
    </div>
  );
}
