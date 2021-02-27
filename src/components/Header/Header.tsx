import React from "react";
import { Link } from "react-router-dom";
import styles from "./_Header.module.scss";

interface IHeader {
  page: string;
}

export default function Header({ page }: IHeader): JSX.Element {
  return (
    <div className={styles.header}>
      <Link
        className={`${styles.link} ${page === "todo" ? styles.active : ""}`}
        to="/"
      >
        To-Do
      </Link>
      <Link
        className={`${styles.link} ${page === "profile" ? styles.active : ""}`}
        to="/profile"
      >
        Profile
      </Link>
    </div>
  );
}
