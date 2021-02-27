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

const collection = "ToDos";

export async function getToDosData(): Promise<
  firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>
> {
  return db.collection(collection).orderBy("createdAt", "desc").get();
}

export async function addToDo(
  newTask: INewToDo
): Promise<
  firebase.firestore.DocumentReference<firebase.firestore.DocumentData>
> {
  return db.collection(collection).add(newTask);
}

export async function removeToDo(id: string): Promise<void> {
  try {
    const document = db.doc(`/ToDos/${id}`);
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
    const document = db.collection(collection).doc(todo.todoId);
    document.update(todo);
  } catch {
    throw new Error("Error");
  }
}
