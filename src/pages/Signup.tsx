import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { error } from "toastr";
import { useAuth } from "@contexts/index";
import { HOME_ROUTE, LOGIN_ROUTE } from "@constants/routes";
import {
  EmailInput,
  PasswordInput,
  PasswordConfirmInput,
} from "@components/auth";

export default function Signup(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const { signup } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();

    if (password === passwordConfirm) {
      try {
        setLoading(true);
        await signup(email, password);
        history.push(HOME_ROUTE);
      } catch {
        error("Failed to create an account");
      }
      return;
    }
    setLoading(false);
    error("Password do not match");
  }

  return (
    <div className="auth__wrapper">
      <div className="auth__card">
        <h2 className="auth__card__title">Sing Up</h2>
        <form className="auth__card__form" onSubmit={handleSubmit}>
          <EmailInput setEmail={setEmail} />
          <PasswordInput setPassword={setPassword} />
          <PasswordConfirmInput
            password={password}
            setPasswordConfirm={setPasswordConfirm}
          />
          <button disabled={loading} className="c-btn-blue" type="submit">
            Sign Up
          </button>
        </form>
      </div>
      <div className="auth__bottom">
        Already have an account?
        <Link className="auth__login-link" to={LOGIN_ROUTE}>
          Log In
        </Link>
      </div>
    </div>
  );
}
