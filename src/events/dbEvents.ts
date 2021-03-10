import { format, parse } from "date-fns";
import firebase from "firebase/app";
import { db } from "../firebase";

export interface IToDo {
  todoId: string;
  title: string;
  body: string;
  isComplete: boolean;
  createdAt: string;
}

export interface INewToDo {
  title: string;
  body: string;
  isComplete: boolean;
  createdAt: string;
}

export interface IDayStatuses {
  haveCompleted: boolean;
  haveUncompleted: boolean;
  date: Date;
}

export async function clearDB(): Promise<void> {
  const newDate = format(new Date(), "MM_dd_yyyy");
  const userDays = db.collection("users").doc(window.userId).collection("days");
  userDays
    .where(firebase.firestore.FieldPath.documentId(), "<", newDate)
    .get()
    .then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        doc.ref.delete();
      });
    });
}

export async function getToDosData(
  date: Date
): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
  const newDate = format(new Date(date), "MM_dd_yyyy");
  const dateRef = db.doc(`/users/${window.userId}/days/${newDate}/`);
  return dateRef.collection("todos").orderBy("createdAt", "desc").get();
}

export async function getDaysStatuses(): Promise<IDayStatuses[]> {
  const result: IDayStatuses[] = [];
  const days = db.collection(`/users/${window.userId}/days/`);
  await days.get().then((data) => {
    data.forEach((doc) => {
      result.push({
        haveCompleted: doc.data().haveCompleted,
        haveUncompleted: doc.data().haveUncompleted,
        date: parse(doc.id, "MM_dd_yyyy", new Date()),
      });
    });
  });
  return result;
}

export async function addToDo(newTask: INewToDo): Promise<IToDo> {
  const taskDate = format(new Date(newTask.createdAt), "MM_dd_yyyy");
  const dayRef = db.doc(`/users/${window.userId}/days/${taskDate}/`);
  await dayRef.set({ haveUncompleted: true });
  const todo: IToDo = {
    ...newTask,
    todoId: "",
  };
  await dayRef
    .collection("todos")
    .add(newTask)
    .then((doc) => {
      todo.todoId = doc.id;
    });
  return todo;
}

export async function removeToDo(day: string, taskId: string): Promise<void> {
  const formattingDay = format(new Date(day), "MM_dd_yyyy");
  try {
    const taskRef = db.doc(
      `/users/${window.userId}/days/${formattingDay}/todos/${taskId}`
    );
    await taskRef
      .get()
      .then((doc) => {
        if (!doc.exists) {
          throw new Error("Todo not found!");
        }
        taskRef.delete();
        return 1;
      })
      .catch(() => {
        throw new Error("Error");
      });
  } catch {
    throw new Error("Error");
  }
}

export async function editToDo(todo: IToDo, createdAt: string): Promise<void> {
  const taskDate = format(new Date(createdAt), "MM_dd_yyyy");
  try {
    const taskRef = db.doc(
      `/users/${window.userId}/days/${taskDate}/todos/${todo.todoId}`
    );
    taskRef.update(todo);
  } catch {
    throw new Error("Error");
  }
}

export async function changeToDoStatus(
  date: string,
  todoId: string,
  isComplete: boolean
): Promise<void> {
  try {
    const formattingDate = format(new Date(date), "MM_dd_yyyy");
    const taskRef = db.doc(
      `/users/${window.userId}/days/${formattingDate}/todos/${todoId}/`
    );
    taskRef.update({ isComplete });
  } catch {
    throw new Error("Error");
  }
}

export async function changeDayStatuses(statuses: IDayStatuses): Promise<void> {
  try {
    const formattingDate = format(new Date(statuses.date), "MM_dd_yyyy");
    const dayRef = db.doc(`/users/${window.userId}/days/${formattingDate}`);
    dayRef.update({
      haveCompleted: statuses.haveCompleted,
      haveUncompleted: statuses.haveUncompleted,
    });
  } catch {
    throw new Error("Error");
  }
}
