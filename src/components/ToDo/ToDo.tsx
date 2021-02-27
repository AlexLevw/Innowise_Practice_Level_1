import React, { useEffect, useState } from "react";
import styles from "./_ToDo.module.scss";
import { getToDosData, editToDo, IToDo } from "../../events/dbEvents";
import Header from "../Header/Header";
import CreateTask from "./CreateTask/CreateTask";
import Task from "./Task/Task";

export default function ToDo(): JSX.Element {
  const [toDos, setToDos] = useState<IToDo[]>([]);
  const [creation, setCreation] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<IToDo | null>(null);

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

  const getToDos = (): void => {
    getToDosData().then((data) => {
      const ToDos: IToDo[] = [];
      data.forEach((doc) => {
        ToDos.push({
          todoId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          isComplete: doc.data().isComplete,
          createdAt: doc.data().createdAt,
        });
      });
      setToDos(ToDos);
    });
  };

  function changeToDoStatus(
    e: React.ChangeEvent<HTMLInputElement>,
    todo: IToDo
  ) {
    e.target.readOnly = true;
    const newToDo = {
      todoId: todo.todoId,
      isComplete: !todo.isComplete,
    };
    editToDo(newToDo as IToDo).then(() => getToDos());
    e.target.readOnly = false;
  }

  function createToDos(list: IToDo[]): JSX.Element[] {
    return list.map((item) => {
      return (
        <div
          className={styles.task}
          key={item.todoId}
          onClick={() => setSelectedTask(item)}
          role="presentation"
        >
          <div className={styles.taskCheckbox}>
            <input
              type="checkbox"
              checked={item.isComplete}
              onChange={(e) => changeToDoStatus(e, item)}
              onClick={(e) => e.stopPropagation()}
            />
            <span> </span>
          </div>
          <p>{item.title}</p>
        </div>
      );
    });
  }

  useEffect(() => getToDos(), []);

  return (
    <div className={styles.container}>
      <Header page="todo" />
      {/* <div className={styles.calendar}>{createDays()}</div> */}
      <div className={styles.tasks}>
        <p className={styles.tasksTitle}>Tasks</p>
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
      {creation && (
        <CreateTask
          closeCreator={() => setCreation(false)}
          getToDos={getToDos}
        />
      )}
      {selectedTask && (
        <Task
          closeTask={() => setSelectedTask(null)}
          getToDos={getToDos}
          task={selectedTask}
        />
      )}
    </div>
  );
}
