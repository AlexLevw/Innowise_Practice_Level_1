import React, { useRef } from "react";

interface Props {
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}

export default function EmailInput({ setEmail }: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement>({} as HTMLInputElement);

  function handleChange() {
    setEmail(inputRef.current.value);
  }

  return (
    <input
      type="email"
      ref={inputRef}
      placeholder="email"
      onChange={handleChange}
    />
  );
}
