import React from "react";
import { IToDo, changeToDoStatus } from "@events/dbEvents";
import styles from "./_Task.module.scss";

interface ITaskProps {
  task: IToDo;
  setSelectedTask: React.Dispatch<React.SetStateAction<IToDo | null>>;
  checkDayStatuses: (todoId: string, todoIsComplete: boolean) => void;
}

export default function Task({
  task,
  setSelectedTask,
  checkDayStatuses,
}: ITaskProps): JSX.Element {
  function handlerChangeToDoStatus(
    e: React.ChangeEvent<HTMLInputElement>,
    todo: IToDo
  ) {
    e.target.readOnly = true;
    changeToDoStatus(todo.createdAt, todo.todoId, !todo.isComplete).then(() => {
      checkDayStatuses(todo.todoId, !todo.isComplete);
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
          onChange={(e) => handlerChangeToDoStatus(e, task)}
          onClick={(e) => e.stopPropagation()}
        />
        <span> </span>
      </div>
      <p>{task.title}</p>
    </div>
  );
}
