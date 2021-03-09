import React from "react";
import { Link, useHistory } from "react-router-dom";
import { HOME_ROUTE, PROFILE_ROUTE } from "@constants/routes";
import styles from "./_Header.module.scss";

export default function Header(): JSX.Element {
  const history = useHistory();
  const activePage =
    history.location.pathname === PROFILE_ROUTE ? "profile" : "todo";

  return (
    <div className={styles.header}>
      <Link
        className={`${styles.link} ${
          activePage === "todo" ? styles.active : ""
        }`}
        to={HOME_ROUTE}
      >
        To-Do
      </Link>
      <Link
        className={`${styles.link} ${
          activePage === "profile" ? styles.active : ""
        }`}
        to={PROFILE_ROUTE}
      >
        Profile
      </Link>
    </div>
  );
}
