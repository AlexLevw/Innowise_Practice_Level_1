import React, { useRef, useState, useContext } from "react";
import { error } from "toastr";
import { addToDo, INewToDo } from "@events/dbEvents";
import { ToDoContext } from "@contexts/index";
import styles from "./_styles.module.scss";

interface Props {
  close: CallableFunction;
}

export default function Form({ close }: Props): JSX.Element {
  const titleRef = useRef<HTMLInputElement>({} as HTMLInputElement);
  const bodyRef = useRef<HTMLTextAreaElement>({} as HTMLTextAreaElement);
  const [loading, setLoading] = useState<boolean>(false);
  const { addToDoLocal, selectedDate } = useContext(ToDoContext);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const newTask: INewToDo = {
      title: titleRef.current.value,
      body: bodyRef.current.value,
      isComplete: false,
      createdAt: selectedDate.toISOString(),
    };

    addToDo(newTask)
      .then((todo) => {
        addToDoLocal(todo);
        close();
      })
      .catch(() => {
        setLoading(false);
        error("Error");
      });
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
      <label className={`c-input ${styles.body}`} htmlFor="task-body">
        Details:
        <textarea ref={bodyRef} id="task-body" name="task-body" />
      </label>
      <button disabled={loading} className="c-btn-blue" type="submit">
        Create
      </button>
    </form>
  );
}
