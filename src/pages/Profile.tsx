import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useAuth } from "@contexts/index";
import { Header } from "@components/index";
import { UPDATE_PROFILE_ROUTE, LOGIN_ROUTE } from "@constants/routes";

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
      history.push(LOGIN_ROUTE);
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <div className="profile__wrapper">
      <Header />
      {error && error}
      <div className="profile__main">
        Profile: {currentUser.email}
        <button
          className="profile__theme-switcher-btn"
          onClick={() => switchTheme()}
          type="button"
        >
          Switch theme
        </button>
        <Link className="profile__update-btn" to={UPDATE_PROFILE_ROUTE}>
          Update Profile
        </Link>
        <button
          className="profile__logout-btn"
          type="button"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
