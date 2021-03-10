import { createContext } from "react";
import { IToDo } from "@events/dbEvents";

interface IToDoContext {
  addToDoLocal: (newToDo: IToDo) => void;
  editToDoLocal: (task: IToDo) => void;
  removeToDoLocal: (taskId: string) => void;
}

const ToDoContext = createContext<IToDoContext>({} as IToDoContext);

export default ToDoContext;
