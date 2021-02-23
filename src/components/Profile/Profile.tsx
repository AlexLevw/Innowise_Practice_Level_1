import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import styles from "./_Profile.module.scss";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile(): JSX.Element {
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
      {error && error}
      Profile: {currentUser?.email}
      <div>
        <button type="button" onClick={handleLogout}>
          Log Out
        </button>
        <Link to="/update-profile">Update Profile</Link>
      </div>
    </div>
  );
}
