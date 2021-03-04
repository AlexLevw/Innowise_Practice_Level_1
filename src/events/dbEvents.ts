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
  const userDays = db.collection("users").doc(window.userId).collection("days");
  return userDays
    .doc(newDate)
    .collection("todos")
    .orderBy("createdAt", "desc")
    .get();
}

export async function getDaysStatuses(): Promise<IDayStatuses[]> {
  const result: IDayStatuses[] = [];
  const days = db.collection("users").doc(window.userId).collection("days");
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
  const document = db
    .collection("users")
    .doc(window.userId)
    .collection("days")
    .doc(format(new Date(newTask.createdAt), "MM_dd_yyyy"));
  await document.set({ haveUncompleted: true });
  const todo: IToDo = {
    ...newTask,
    todoId: "",
  };
  await document
    .collection("todos")
    .add(newTask)
    .then((doc) => {
      todo.todoId = doc.id;
    });
  return todo;
}

export async function removeToDo(day: string, taskId: string): Promise<void> {
  try {
    const document = db.doc(
      `/users/${window.userId}/days/${format(
        new Date(day),
        "MM_dd_yyyy"
      )}/todos/${taskId}`
    );
    await document
      .get()
      .then((doc) => {
        if (!doc.exists) {
          throw new Error("Todo not found!");
        }
        document.delete();
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
  try {
    const document = db.doc(
      `/users/${window.userId}/days/${format(
        new Date(createdAt),
        "MM_dd_yyyy"
      )}/todos/${todo.todoId}`
    );
    document.update(todo);
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
    const dayRef = db.doc(
      `/users/${window.userId}/days/${format(new Date(date), "MM_dd_yyyy")}`
    );
    dayRef.collection("todos").doc(todoId).update({ isComplete });
  } catch {
    throw new Error("Error");
  }
}

export async function changeDayStatuses(statuses: IDayStatuses): Promise<void> {
  try {
    const dayRef = db.doc(
      `/users/${window.userId}/days/${format(
        new Date(statuses.date),
        "MM_dd_yyyy"
      )}`
    );
    dayRef.update({
      haveCompleted: statuses.haveCompleted,
      haveUncompleted: statuses.haveUncompleted,
    });
  } catch {
    throw new Error("Error");
  }
}
