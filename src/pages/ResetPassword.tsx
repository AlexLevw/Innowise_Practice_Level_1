import React, { useState } from "react";
import { Link } from "react-router-dom";
import { error } from "toastr";
import { useAuth } from "@contexts/index";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "@constants/routes";
import { EmailInput } from "@components/auth";

export default function ResetPassword(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const { resetPassword } = useAuth();
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setMessage("");
      setLoading(true);
      await resetPassword(email);
      setMessage("Check your inbox for further instructions");
    } catch {
      error("Failed to reset password");
    }
    setLoading(false);
  }

  return (
    <div className="auth__wrapper">
      <div className="auth__card">
        <h2 className="auth__card__title">Reset Password</h2>
        {message}
        <form className="auth__card__form" onSubmit={handleSubmit}>
          <EmailInput setEmail={setEmail} />
          <button disabled={loading} className="c-btn-blue" type="submit">
            Send
          </button>
          <Link to={LOGIN_ROUTE}>Log In</Link>
        </form>
      </div>
      <div className="auth__bottom">
        Need an account?
        <Link className="auth__login-link" to={REGISTER_ROUTE}>
          Sign Up
        </Link>
      </div>
    </div>
  );
}
