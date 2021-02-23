import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./_ResetPassword.module.scss";
import { useAuth } from "../../contexts/AuthContext";

export default function ResetPassword(): JSX.Element {
  const emailRef = useRef<HTMLInputElement>(null);
  const { resetPassword } = useAuth();
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (emailRef.current) {
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
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Reset Password</h2>
        {error}
        {message}
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
          <button disabled={loading} className={styles.submitBtn} type="submit">
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
