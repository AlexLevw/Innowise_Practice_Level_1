import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { error } from "toastr";
import { useAuth } from "@contexts/index";
import {
  HOME_ROUTE,
  REGISTER_ROUTE,
  RESET_PASSWORD_ROUTE,
} from "@constants/routes";
import { EmailInput, PasswordInput } from "@components/auth";

export default function Login(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      await login(email, password);
      history.push(HOME_ROUTE);
    } catch {
      setLoading(false);
      error("Failed to sign in");
    }
  }

  return (
    <div className="auth__wrapper">
      <div className="auth__card">
        <h2 className="auth__card__title">Log In</h2>
        <form className="auth__card__form" onSubmit={handleSubmit}>
          <EmailInput setEmail={setEmail} />
          <PasswordInput setPassword={setPassword} />
          <button disabled={loading} className="c-btn-blue" type="submit">
            Log In
          </button>
          <Link to={RESET_PASSWORD_ROUTE}>Forgot password?</Link>
        </form>
      </div>
      <div className="auth__bottom">
        Need an account?
        <Link className="auth__signup-link" to={REGISTER_ROUTE}>
          Sign Up
        </Link>
      </div>
    </div>
  );
}
