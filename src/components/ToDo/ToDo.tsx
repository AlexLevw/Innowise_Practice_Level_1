import React from "react";
import { Link } from "react-router-dom";
import styles from "./_ToDo.module.scss";

export default function ToDo(): JSX.Element {
  function createDays(): JSX.Element {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.title}>To-Do</p>
        <Link to="profile">Profile</Link>
      </div>
      <div className={styles.calendar}>{createDays()}</div>
      <div className={styles.tasks}>
        <p className={styles.tasksTitle}>Tasks:</p>
        <button type="button">Create task</button>
      </div>
    </div>
  );
}
