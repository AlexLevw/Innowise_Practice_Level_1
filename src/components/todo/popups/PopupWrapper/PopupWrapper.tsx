import React from "react";
import styles from "./_styles.module.scss";

interface Props {
  children: JSX.Element | JSX.Element[];
  close: CallableFunction;
}

export default function PopupWrapper({ children, close }: Props): JSX.Element {
  function handleClickOutside(e: React.MouseEvent): void {
    if ((e.target as HTMLDivElement).className === styles.container) {
      close();
    }
  }

  return (
    <div
      className={styles.container}
      onClick={handleClickOutside}
      role="presentation"
    >
      <div className={styles.main}>{children}</div>
    </div>
  );
}
