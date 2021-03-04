import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "@contexts/AuthContext";
import styles from "./_Profile.module.scss";
import Header from "../Header/Header";

interface IProfileProps {
  switchTheme: CallableFunction;
}

export default function Profile({ switchTheme }: IProfileProps): JSX.Element {
  const [error, setError] = useState<string>();
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout(): Promise<void> {
    try {
      await logout();
      history.push("./login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <div className={styles.container}>
      <Header page="profile" />
      {error && error}
      <div className={styles.main}>
        Profile: {currentUser.email}
        <button
          className={styles.themeSwitcher}
          onClick={() => switchTheme()}
          type="button"
        >
          Switch theme
        </button>
        <Link className={styles.update} to="/update-profile">
          Update Profile
        </Link>
        <button
          className={styles.logoutBtn}
          type="button"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
