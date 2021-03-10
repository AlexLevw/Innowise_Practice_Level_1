import React, { useState, useRef, useContext } from "react";
import { format } from "date-fns";
import trashIcon from "@assets/icons/trash.svg";
import { removeToDo, editToDo, IToDo } from "@events/dbEvents";
import { ToDoContext } from "@contexts/index";
import styles from "./_EditTask.module.scss";

interface ITaskProps {
  closeTask: CallableFunction;
  task: IToDo;
}

export default function Task({ closeTask, task }: ITaskProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [taskChanged, setTaskChanged] = useState<boolean>(false);

  const titleRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const bodyRef = useRef<HTMLTextAreaElement>({} as HTMLTextAreaElement);

  const { editToDoLocal, removeToDoLocal } = useContext(ToDoContext);

  const handleClickOutside = (e: React.MouseEvent): void => {
    if ((e.target as HTMLDivElement).className === styles.container) {
      closeTask();
    }
  };

  const handleTaskEdit = (): void => {
    if (
      taskChanged &&
      titleRef.current.value === task.title &&
      bodyRef.current.value === task.body
    ) {
      setTaskChanged(false);
    } else if (!taskChanged) {
      setTaskChanged(true);
    }
  };

  const handleSaveChanges = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setLoading(true);

    const newToDo: IToDo = {
      todoId: task.todoId,
      title: titleRef.current.value,
      body: bodyRef.current.value,
      isComplete: task.isComplete,
      createdAt: task.createdAt,
    };

    editToDo(newToDo as IToDo, task.createdAt)
      .then(() => {
        closeTask();
        editToDoLocal(newToDo);
      })
      .catch(() => setLoading(false));
  };

  const removeTask = (): void => {
    setError("");
    setLoading(true);

    removeToDo(task.createdAt, task.todoId)
      .then(() => {
        closeTask();
        removeToDoLocal(task.todoId);
      })
      .catch(() => {
        setError("Error");
        setLoading(false);
      });
  };

  const closeWindow = (): void => closeTask();

  return (
    <div
      className={styles.container}
      onClick={handleClickOutside}
      role="presentation"
    >
      <form className={styles.main} onSubmit={handleSaveChanges}>
        {error && error}
        <button
          className="c-closeCross"
          onClick={closeWindow}
          type="button"
          aria-label="Close"
        />
        <p className={styles.date}>
          {format(new Date(task.createdAt), "MM/dd/yyyy")}
        </p>
        <input
          className={styles.title}
          ref={titleRef}
          defaultValue={task.title}
          onChange={handleTaskEdit}
        />
        <textarea
          className={styles.body}
          ref={bodyRef}
          defaultValue={task.body}
          onChange={handleTaskEdit}
        />
        <div className={styles.bottom}>
          <button
            className={`${styles.saveBtn} c-btn-blue`}
            type="submit"
            disabled={!taskChanged || loading}
          >
            Save
          </button>
          <button
            className={styles.trashBtn}
            disabled={loading}
            type="button"
            onClick={removeTask}
          >
            <img src={trashIcon} alt="trash" />
          </button>
        </div>
      </form>
    </div>
  );
}
