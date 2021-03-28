import React, { useRef, useState, useContext, useEffect } from "react";
import { error } from "toastr";
import { format } from "date-fns";
import trashIcon from "@assets/icons/trash.svg";
import { removeToDo, editToDo, IToDo } from "@events/dbEvents";
import { ToDoContext } from "@contexts/index";
import styles from "./_styles.module.scss";

interface Props {
  close: CallableFunction;
  task: IToDo;
}

export default function Form({ close, task }: Props): JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const bodyRef = useRef<HTMLTextAreaElement>({} as HTMLTextAreaElement);

  const { editToDoLocal, removeToDoLocal } = useContext(ToDoContext);

  function checkChanged() {
    if (
      isChanged &&
      titleRef.current.value === task.title &&
      bodyRef.current.value === task.body
    ) {
      setIsChanged(false);
    } else if (!isChanged) {
      setIsChanged(true);
    }
  }

  function handleTitleChange() {
    checkChanged();
    if (!titleRef.current.value) {
      setHasError(true);
      return;
    }
    setHasError(false);
  }

  function handleBodyChange() {
    checkChanged();
  }

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
        close();
        editToDoLocal(newToDo);
      })
      .catch(() => setLoading(false));
  };

  const removeTask = (): void => {
    setLoading(true);

    removeToDo(task.createdAt, task.todoId)
      .then(() => {
        close();
        removeToDoLocal(task.todoId);
      })
      .catch(() => {
        error("Error");
        setLoading(false);
      });
  };

  useEffect((): void => {
    titleRef.current.value = task.title;
    bodyRef.current.value = task.body;
  }, [task.title, task.body]);

  return (
    <form className={styles.form} onSubmit={handleSaveChanges}>
      <button
        className="c-closeCross"
        onClick={() => close()}
        type="button"
        aria-label="Close"
        disabled={loading}
      />
      <p className={styles.date}>
        {format(new Date(task.createdAt), "MM/dd/yyyy")}
      </p>
      <label className="c-input" htmlFor="task-title">
        Title:
        <input
          ref={titleRef}
          id="task-title"
          type="text"
          onChange={handleTitleChange}
        />
      </label>
      <label className={`c-input ${styles.body}`} htmlFor="task-body">
        Details:
        <textarea ref={bodyRef} id="task-body" onChange={handleBodyChange} />
      </label>
      <div className={styles.bottom}>
        <button
          className={`${styles.saveBtn} c-btn-blue`}
          type="submit"
          disabled={hasError || loading || !isChanged}
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
  );
}
