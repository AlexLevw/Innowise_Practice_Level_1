import React from "react";
import { IToDo } from "@events/dbEvents";
import Task from "./Task/Task";
import styles from "./_styles.module.scss";

interface Props {
  toDos: IToDo[];
  setCreation: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Tasks({ toDos, setCreation }: Props): JSX.Element {
  const openCreator = (): void => setCreation(true);

  return (
    <div className={styles.tasks}>
      <p className={styles.tasksTitle}>Tasks</p>
      <div className={styles.tasksList}>
        {toDos.map((item) => {
          return <Task key={item.todoId} task={item} />;
        })}
      </div>
      <button
        className={`${styles.createTaskBtn} c-btn-orange`}
        type="button"
        onClick={openCreator}
      >
        Create task
      </button>
    </div>
  );
}
