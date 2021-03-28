import React, { useRef } from "react";

interface Props {
  setPassword: React.Dispatch<React.SetStateAction<string>>;
}

export default function PasswordInput({ setPassword }: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

  function handleChange() {
    setPassword(inputRef.current.value);
  }

  return (
    <input
      type="password"
      ref={inputRef}
      placeholder="password"
      onChange={handleChange}
    />
  );
}
