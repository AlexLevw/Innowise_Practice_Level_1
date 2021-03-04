import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import styles from "./_ResetPassword.module.scss";

export default function ResetPassword(): JSX.Element {
  const emailRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions");
    } catch {
      setError("Failed to reset password");
    }
    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Reset Password</h2>
        {error}
        {message}
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
          <button disabled={loading} className="c-btn-blue" type="submit">
            Send
          </button>
          <Link to="/login">Log In</Link>
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
