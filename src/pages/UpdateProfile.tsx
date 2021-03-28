import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { error } from "toastr";
import { useAuth } from "@contexts/index";
import { PROFILE_ROUTE } from "@constants/routes";
import {
  EmailInput,
  PasswordInput,
  PasswordConfirmInput,
} from "@components/auth";

export default function UpdateProfile(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password === passwordConfirm) {
      setLoading(true);

      const promises = [];
      if (email !== currentUser.email) {
        promises.push(updateEmail(email));
      }
      if (password) {
        promises.push(updatePassword(password));
      }

      Promise.all(promises)
        .then(() => {
          history.push(PROFILE_ROUTE);
        })
        .catch(() => {
          error("Failed to update profile");
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }
    error("Password do not match");
  }

  return (
    <div className="auth__wrapper">
      <div className="auth__card">
        <h2 className="auth__card__title">Update Profile</h2>
        <form className="auth__card__form" onSubmit={handleSubmit}>
          <EmailInput setEmail={setEmail} />
          <PasswordInput setPassword={setPassword} />
          <PasswordConfirmInput
            password={password}
            setPasswordConfirm={setPasswordConfirm}
          />
          <button disabled={loading} className="c-btn-blue" type="submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
