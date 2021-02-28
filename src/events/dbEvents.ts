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

export async function getToDosData(
  userId: string
): Promise<firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>> {
  return db.collection(userId).orderBy("createdAt", "desc").get();
}

export async function addToDo(
  userId: string,
  newTask: INewToDo
): Promise<
  firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
> {
  return db.collection(userId).add(newTask);
}

export async function removeToDo(
  userId: string,
  taskId: string
): Promise<void> {
  try {
    const document = db.doc(`/${userId}/${taskId}`);
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

export async function editToDo(userId: string, todo: IToDo): Promise<void> {
  try {
    const document = db.collection(userId).doc(todo.todoId);
    document.update(todo);
  } catch {
    throw new Error("Error");
  }
}
