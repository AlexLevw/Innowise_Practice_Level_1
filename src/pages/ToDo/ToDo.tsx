import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  getToDosData,
  IToDo,
  changeDayStatuses,
  IDayStatuses,
  getDaysStatuses,
} from "@events/dbEvents";
import { Header } from "@components/index";
import Calendar from "./Calendar/Calendar";
import CreateTask from "./CreateTask/CreateTask";
import EditTask from "./EditTask/EditTask";
import Task from "./Task/Task";
import styles from "./_ToDo.module.scss";

export default function ToDo(): JSX.Element {
  const [toDos, setToDos] = useState<IToDo[]>([]);
  const [creation, setCreation] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<IToDo | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [daysStatuses, setDaysStatuses] = useState<IDayStatuses[]>(
    [] as IDayStatuses[]
  );

  function checkDayStatuses(
    todoId: string,
    todoIsComplete: boolean,
    currentToDos: IToDo[] = toDos
  ) {
    const todayStatusesIndex = daysStatuses.findIndex(
      (elem) =>
        format(new Date(elem.date), "MM/dd/yyyy") ===
        format(selectedDate, "MM/dd/yyyy")
    );
    const todayStatuses = daysStatuses[todayStatusesIndex];
    if (todayStatuses) {
      const newToDos: IToDo[] = [...currentToDos];
      let haveCompleted = false;
      let haveUncompleted = false;
      const todoIndex: number = newToDos.findIndex(
        (elem) => elem.todoId === todoId
      );
      newToDos[todoIndex].isComplete = todoIsComplete;
      newToDos.forEach((elem) => {
        if (elem.isComplete) {
          haveCompleted = true;
        } else {
          haveUncompleted = true;
        }
      });
      if (
        todayStatuses.haveCompleted !== haveCompleted ||
        todayStatuses.haveUncompleted !== haveUncompleted
      ) {
        const newDayStatuses: IDayStatuses = {
          haveCompleted,
          haveUncompleted,
          date: todayStatuses.date,
        };
        changeDayStatuses(newDayStatuses);
        const newDaysStatuses: IDayStatuses[] = [...daysStatuses];
        newDaysStatuses[todayStatusesIndex] = newDayStatuses;
        setDaysStatuses(newDaysStatuses);
      }
    } else {
      const newDayStatuses: IDayStatuses = {
        haveCompleted: false,
        haveUncompleted: true,
        date: selectedDate,
      };
      changeDayStatuses(newDayStatuses);
      const newDaysStatuses: IDayStatuses[] = [...daysStatuses, newDayStatuses];
      setDaysStatuses(newDaysStatuses);
    }
  }

  const addToDoLocal = (newToDo: IToDo): void => {
    const newToDos: IToDo[] = [newToDo, ...toDos];
    setToDos(newToDos);
    checkDayStatuses(newToDo.todoId, newToDo.isComplete, newToDos);
  };

  const editToDoLocal = (task: IToDo): void => {
    const newToDos: IToDo[] = [...toDos];
    const editedToDoIndex: number = newToDos.findIndex(
      (elem) => elem.todoId === task.todoId
    );
    newToDos[editedToDoIndex] = task;
    setToDos(newToDos);
  };

  const removeToDoLocal = (taskId: string): void => {
    const newToDos: IToDo[] = [...toDos];
    const removedTaskIndex: number = newToDos.findIndex(
      (elem) => elem.todoId === taskId
    );
    newToDos.splice(removedTaskIndex, 1);
    setToDos(newToDos);
    const todayStatusesIndex: number = daysStatuses.findIndex(
      (elem) =>
        format(new Date(elem.date), "MM/dd/yyyy") ===
        format(selectedDate, "MM/dd/yyyy")
    );
    const todayStatuses: IDayStatuses = daysStatuses[todayStatusesIndex];
    let haveCompleted = false;
    let haveUncompleted = false;
    newToDos.forEach((elem) => {
      if (elem.isComplete) {
        haveCompleted = true;
      } else {
        haveUncompleted = true;
      }
    });
    if (
      todayStatuses.haveCompleted !== haveCompleted ||
      todayStatuses.haveUncompleted !== haveUncompleted
    ) {
      const newDayStatuses: IDayStatuses = {
        haveCompleted,
        haveUncompleted,
        date: todayStatuses.date,
      };
      changeDayStatuses(newDayStatuses);
      const newDaysStatuses: IDayStatuses[] = [...daysStatuses];
      newDaysStatuses[todayStatusesIndex] = newDayStatuses;
      setDaysStatuses(newDaysStatuses);
    }
  };

  useEffect(() => {
    getDaysStatuses().then((data) => {
      setDaysStatuses(data);
    });
  }, []);

  useEffect(() => {
    getToDosData(selectedDate).then((data) => {
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
  }, [selectedDate]);

  return (
    <div className={styles.container}>
      <Header />
      <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        daysStatuses={daysStatuses}
      />
      <div className={styles.tasks}>
        <p className={styles.tasksTitle}>Tasks</p>
        <div className={styles.tasksList}>
          {toDos.map((item) => {
            return (
              <Task
                key={item.todoId}
                task={item}
                setSelectedTask={setSelectedTask}
                checkDayStatuses={checkDayStatuses}
              />
            );
          })}
        </div>
        <button
          className={`${styles.createTaskBtn} c-btn-orange`}
          type="button"
          onClick={() => setCreation(true)}
        >
          Create task
        </button>
      </div>
      {creation && (
        <CreateTask
          closeCreator={() => setCreation(false)}
          addToDoLocal={addToDoLocal}
          selectedDate={selectedDate}
        />
      )}
      {selectedTask && (
        <EditTask
          closeTask={() => setSelectedTask(null)}
          editToDoLocal={(task) => editToDoLocal(task)}
          removeToDoLocal={(taskId) => removeToDoLocal(taskId)}
          task={selectedTask}
        />
      )}
    </div>
  );
}
