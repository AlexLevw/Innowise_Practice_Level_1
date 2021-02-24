import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./_ToDo.module.scss";
import { db } from "../../firebase";
import CreateTask from "./CreateTask/CreateTask";

interface IToDo {
  todoId: string;
  title: string;
  body: string;
  createdAt: string;
}

export default function ToDo(): JSX.Element {
  const [toDos, setToDos] = useState<IToDo[]>([]);
  const [creation, setCreation] = useState<boolean>(false);

  // function createDays(): JSX.Element[] {
  //   const dataArr = new Array(2).fill({
  //     title: "title",
  //     number: "number",
  //   });
  //   return dataArr.map((item, id) => {
  //     return (
  //       <div className={styles.calendarDay} key={id!}>
  //         <p>{item.title}</p>
  //         <p>{item.number}</p>
  //       </div>
  //     );
  //   });
  // }

  function createToDos(list: IToDo[]) {
    return list.map((item) => {
      return (
        <div className={styles.task} key={item.todoId}>
          <p>{item.title}</p>
          <p>{item.body}</p>
        </div>
      );
    });
  }

  useEffect(() => {
    db.collection("ToDos")
      .orderBy("createdAt", "desc")
      .get()
      .then((data) => {
        const ToDos: IToDo[] = [];
        data.forEach((doc) => {
          ToDos.push({
            todoId: doc.id,
            title: doc.data().title,
            body: doc.data().body,
            createdAt: doc.data().createdAt,
          });
        });
        setToDos(ToDos);
      });
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <p className={styles.title}>To-Do</p>
        <Link to="profile">Profile</Link>
      </div>
      {/* <div className={styles.calendar}>{createDays()}</div> */}
      <div className={styles.tasks}>
        <p className={styles.tasksTitle}>Tasks:</p>
        <div className={styles.tasksList}>{createToDos(toDos)}</div>
        <button
          className="c-btn-orange"
          style={{ width: "100%" }}
          type="button"
          onClick={() => setCreation(true)}
        >
          Create task
        </button>
      </div>
      {creation && <CreateTask closeCreator={() => setCreation(false)} />}
    </div>
  );
}
