import React, { useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styles from "./_Signup.module.scss";
import { useAuth } from "../../contexts/AuthContext";

export default function Signup(): JSX.Element {
  const emailRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const passwordRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const passwordConfirmRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const { signup } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (passwordRef.current.value === passwordConfirmRef.current.value) {
      try {
        setError("");
        setLoading(true);
        await signup(emailRef.current.value, passwordRef.current.value);
        history.push("/");
      } catch {
        setError("Failed to create an account");
      }
    } else {
      setError("Password do not match");
    }
    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Sing Up</h2>
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
          <label className="c-input" htmlFor="password-confirm">
            <p>Password Confirm:</p>
            <input
              id="password-confirm"
              name="password-confirm"
              type="password"
              ref={passwordConfirmRef}
              required
            />
          </label>
          <button disabled={loading} className="c-btn-blue" type="submit">
            Sign Up
          </button>
        </form>
      </div>
      <div className={styles.bottom}>
        Already have an account?
        <Link className={styles.loginLink} to="/login">
          Log In
        </Link>
      </div>
    </div>
  );
}
