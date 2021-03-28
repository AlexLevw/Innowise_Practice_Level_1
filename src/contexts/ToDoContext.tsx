import { createContext } from "react";
import { IToDo } from "@events/dbEvents";

interface IToDoContext {
  addToDoLocal: (newToDo: IToDo) => void;
  editToDoLocal: (task: IToDo) => void;
  removeToDoLocal: (taskId: string) => void;
  checkDayStatuses: (
    todoId: string,
    todoIsComplete: boolean,
    currentToDos?: IToDo[]
  ) => void;
  setSelectedTask: React.Dispatch<React.SetStateAction<IToDo | null>>;
  selectedDate: Date;
}

const ToDoContext = createContext<IToDoContext>({} as IToDoContext);

export default ToDoContext;
