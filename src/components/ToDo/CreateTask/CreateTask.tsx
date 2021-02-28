import React, { useRef, useState } from "react";
import styles from "./_CreateTask.module.scss";
import { addToDo, INewToDo } from "../../../events/dbEvents";

interface ICreateTaskProps {
  closeCreator: CallableFunction;
  getToDos: CallableFunction;
}

export default function CreateTask({
  closeCreator,
  getToDos,
}: ICreateTaskProps): JSX.Element {
  const titleRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const bodyRef = useRef<HTMLTextAreaElement>({} as HTMLTextAreaElement);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleClickOutside = (e: React.MouseEvent): void => {
    if ((e.target as HTMLDivElement).className === styles.container) {
      closeCreator();
    }
  };

  function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const newTask: INewToDo = {
      title: titleRef.current.value,
      body: bodyRef.current.value,
      isComplete: false,
      createdAt: new Date().toISOString(),
    };

    addToDo(localStorage.userId, newTask)
      .then(() => {
        setLoading(false);
        closeCreator();
        getToDos();
      })
      .catch(() => {
        setLoading(false);
        setError("Error");
      });
  }

  return (
    <div
      className={styles.container}
      onClick={handleClickOutside}
      role="presentation"
    >
      <div className={styles.main}>
        <p className={styles.title}>Create Task</p>
        <button
          className="c-closeCross"
          onClick={() => closeCreator()}
          type="button"
          aria-label="Close"
        />
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}
        <form className={styles.form} onSubmit={handleCreateTask}>
          <label className="c-input" htmlFor="task-title">
            Title:
            <input
              ref={titleRef}
              id="task-title"
              name="task-title"
              type="text"
              required
            />
          </label>
          <label
            className="c-input"
            style={{ height: "100%" }}
            htmlFor="task-body"
          >
            Details:
            <textarea
              ref={bodyRef}
              id="task-body"
              style={{ height: "100%" }}
              name="task-body"
            />
          </label>
          <button disabled={loading} className="c-btn-blue" type="submit">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}
