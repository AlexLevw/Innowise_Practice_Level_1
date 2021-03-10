import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "@contexts/index";
import { PROFILE_ROUTE } from "@constants/routes";
import styles from "./_UpdateProfile.module.scss";

export default function UpdateProfile(): JSX.Element {
  const emailRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const passwordRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const passwordConfirmRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const history = useHistory();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email: string = emailRef.current.value;
    const password: string = passwordRef.current.value;
    const passwordConfirm: string = passwordConfirmRef.current.value;

    if (password === passwordConfirm) {
      setLoading(true);
      setError("");

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
          setError("Failed to update profile");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("Password do not match");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Update Profile</h2>
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
              defaultValue={currentUser.email ? currentUser.email : ""}
            />
          </label>
          <label className={styles.cardFormItem} htmlFor="password">
            <p>Password:</p>
            <input
              id="password"
              name="password"
              type="password"
              ref={passwordRef}
              placeholder="Leave blank to keep the same"
            />
          </label>
          <label className={styles.cardFormItem} htmlFor="confirm-password">
            <p>Confirm Password:</p>
            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              ref={passwordConfirmRef}
              placeholder="Leave blank to keep the same"
            />
          </label>
          <button disabled={loading} className={styles.submitBtn} type="submit">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}
