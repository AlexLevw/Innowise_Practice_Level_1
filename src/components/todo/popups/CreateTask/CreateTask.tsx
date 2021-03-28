import React from "react";
import Form from "./Form/Form";
import PopupWrapper from "../PopupWrapper/PopupWrapper";
import styles from "./_CreateTask.module.scss";

interface ICreateTaskProps {
  closeCreator: CallableFunction;
}

export default function CreateTask({
  closeCreator,
}: ICreateTaskProps): JSX.Element {
  return (
    <PopupWrapper close={closeCreator}>
      <p className={styles.title}>Create Task</p>
      <button
        className="c-closeCross"
        onClick={() => closeCreator()}
        type="button"
        aria-label="Close"
      />
      <Form close={closeCreator} />
    </PopupWrapper>
  );
}
