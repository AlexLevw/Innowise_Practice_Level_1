import React, { useEffect, useState, useCallback } from "react";
import { format } from "date-fns";
import {
  getToDosData,
  IToDo,
  changeDayStatuses,
  IDayStatuses,
  getDaysStatuses,
} from "@events/dbEvents";
import { Header } from "@components";
import { Calendar, Tasks, CreateTask, EditTask } from "@components/todo";
import { ToDoContext } from "@contexts/index";

export default function ToDo(): JSX.Element {
  const [toDos, setToDos] = useState<IToDo[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [daysStatuses, setDaysStatuses] = useState<IDayStatuses[]>(
    [] as IDayStatuses[]
  );

  const [creation, setCreation] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<IToDo | null>(null);

  const checkDayStatuses = useCallback(
    (
      todoId: string,
      todoIsComplete: boolean,
      currentToDos: IToDo[] = toDos
    ): void => {
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
            return;
          }

          haveUncompleted = true;
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
        return;
      }

      const newDayStatuses: IDayStatuses = {
        haveCompleted: false,
        haveUncompleted: true,
        date: selectedDate,
      };
      const newDaysStatuses: IDayStatuses[] = [...daysStatuses, newDayStatuses];

      changeDayStatuses(newDayStatuses);
      setDaysStatuses(newDaysStatuses);
    },
    [daysStatuses, selectedDate, toDos]
  );

  const addToDoLocal = useCallback(
    (newToDo: IToDo): void => {
      const newToDos: IToDo[] = [newToDo, ...toDos];
      setToDos(newToDos);
      checkDayStatuses(newToDo.todoId, newToDo.isComplete, newToDos);
    },
    [checkDayStatuses, toDos]
  );

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

  const closeCreator = (): void => setCreation(false);
  const closeTask = (): void => setSelectedTask(null);

  useEffect((): void => {
    getDaysStatuses().then((data) => {
      setDaysStatuses(data);
    });
  }, []);

  useEffect((): void => {
    getToDosData(selectedDate).then((data) => {
      const ToDos: IToDo[] = [];

      data.forEach((doc): void => {
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
    <ToDoContext.Provider
      value={{
        addToDoLocal,
        editToDoLocal,
        removeToDoLocal,
        checkDayStatuses,
        setSelectedTask,
        selectedDate,
      }}
    >
      <div className="todo__wrapper">
        <Header />
        <Calendar
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          daysStatuses={daysStatuses}
        />
        <Tasks toDos={toDos} setCreation={setCreation} />
        {creation && <CreateTask closeCreator={closeCreator} />}
        {selectedTask && <EditTask closeTask={closeTask} task={selectedTask} />}
      </div>
    </ToDoContext.Provider>
  );
}
