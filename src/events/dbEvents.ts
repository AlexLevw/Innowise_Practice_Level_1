import firebase from "firebase";
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

export async function clearDB(): Promise<void> {
  const newDate = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
  db.collection(window.userId)
    .where("createdAt", "<", newDate)
    .orderBy("createdAt", "desc")
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
  const start = new Date(date.setHours(0, 0, 0, 0)).toISOString();
  const end = new Date(date.setHours(23, 59, 59, 999)).toISOString();
  return db
    .collection(window.userId)
    .where("createdAt", ">=", start)
    .where("createdAt", "<=", end)
    .orderBy("createdAt", "desc")
    .get();
}

export async function addToDo(
  newTask: INewToDo
): Promise<
  firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
> {
  return db.collection(window.userId).add(newTask);
}

export async function removeToDo(taskId: string): Promise<void> {
  try {
    const document = db.doc(`/${window.userId}/${taskId}`);
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

export async function editToDo(todo: IToDo): Promise<void> {
  try {
    const document = db.collection(window.userId).doc(todo.todoId);
    document.update(todo);
  } catch {
    throw new Error("Error");
  }
}
