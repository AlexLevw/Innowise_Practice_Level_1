import React, { useState, useRef } from "react";
import { format } from "date-fns";
import { removeToDo, editToDo, IToDo } from "../../../events/dbEvents";
import styles from "./_Task.module.scss";
import trashIcon from "../../../assets/icons/trash.svg";

interface ITaskProps {
  closeTask: CallableFunction;
  getToDos: CallableFunction;
  task: IToDo;
}

export default function Task({
  closeTask,
  getToDos,
  task,
}: ITaskProps): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [taskChanged, setTaskChanged] = useState<boolean>(false);

  const titleRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const bodyRef = useRef<HTMLTextAreaElement>({} as HTMLTextAreaElement);

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

    const newToDo = {
      todoId: task.todoId,
      title: task.title,
      body: task.body,
    };

    editToDo(newToDo as IToDo)
      .then(() => {
        closeTask();
        getToDos();
      })
      .catch(() => setLoading(false));
  };

  const removeTask = async () => {
    setError("");
    setLoading(true);

    removeToDo(task.todoId)
      .then(() => {
        closeTask();
        getToDos();
      })
      .catch(() => {
        setError("Error");
        setLoading(false);
      });
  };

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
          onClick={() => closeTask()}
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
            className="c-btn-blue"
            style={{ width: "68px" }}
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
