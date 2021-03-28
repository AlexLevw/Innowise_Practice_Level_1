import React, { useRef } from "react";

interface Props {
  password: string;
  setPasswordConfirm: React.Dispatch<React.SetStateAction<string>>;
}

export default function PasswordConfirmInput({
  password,
  setPasswordConfirm,
}: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

  function handleChange() {
    if (password !== inputRef.current.value) return;
    setPasswordConfirm(inputRef.current.value);
  }

  return (
    <input
      type="password"
      ref={inputRef}
      placeholder="password confirm"
      onChange={handleChange}
    />
  );
}
