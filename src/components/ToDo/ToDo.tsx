import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import styles from "./_ToDo.module.scss";
import { getToDosData, editToDo, IToDo } from "../../events/dbEvents";
import Header from "../Header/Header";
import Calendar from "./Calendar/Calendar";
import CreateTask from "./CreateTask/CreateTask";
import Task from "./Task/Task";

export default function ToDo(): JSX.Element {
  const [toDos, setToDos] = useState<IToDo[]>([]);
  const [creation, setCreation] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<IToDo | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const getToDos = (): void => {
    getToDosData(localStorage.userId).then((data) => {
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
    editToDo(localStorage.userId, newToDo as IToDo).then(() => getToDos());
    e.target.readOnly = false;
  }

  useEffect(() => getToDos(), []);

  return (
    <div className={styles.container}>
      <Header page="todo" />
      <Calendar
        selectedDate={selectedDate}
        setSelectedDate={(date: Date) => setSelectedDate(date)}
      />
      <div className={styles.tasks}>
        <p className={styles.tasksTitle}>Tasks</p>
        <div className={styles.tasksList}>
          {toDos.map((item) => {
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
          })}
        </div>
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
