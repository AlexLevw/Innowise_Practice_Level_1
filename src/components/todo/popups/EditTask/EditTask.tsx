import React from "react";
import { IToDo } from "@events/dbEvents";
import PopupWrapper from "../PopupWrapper/PopupWrapper";
import Form from "./Form/Form";

interface ITaskProps {
  closeTask: CallableFunction;
  task: IToDo;
}

export default function Task({ closeTask, task }: ITaskProps): JSX.Element {
  return (
    <PopupWrapper close={closeTask}>
      <Form close={closeTask} task={task} />
    </PopupWrapper>
  );
}
