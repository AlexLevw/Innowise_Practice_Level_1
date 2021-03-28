import React, { useContext } from "react";
import { IToDo, changeToDoStatus } from "@events/dbEvents";
import { ToDoContext } from "@contexts/index";
import styles from "./_Task.module.scss";

interface ITaskProps {
  task: IToDo;
}

export default function Task({ task }: ITaskProps): JSX.Element {
  const { checkDayStatuses, setSelectedTask } = useContext(ToDoContext);

  function handlerInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.target.readOnly = true;
    changeToDoStatus(task.createdAt, task.todoId, !task.isComplete).then(() => {
      checkDayStatuses(task.todoId, !task.isComplete);
      e.target.readOnly = false;
    });
  }

  return (
    <div
      className={styles.task}
      key={task.todoId}
      onClick={() => setSelectedTask(task)}
      role="presentation"
    >
      <div className={styles.taskCheckbox}>
        <input
          type="checkbox"
          defaultChecked={task.isComplete}
          onChange={handlerInputChange}
          onClick={(e) => e.stopPropagation()}
        />
        <span> </span>
      </div>
      <p>{task.title}</p>
    </div>
  );
}
