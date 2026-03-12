import { useId } from "react";

export default function UseId() {
  const id = useId();

  return (
    <div>
      <h2>useId</h2>
      <label htmlFor={id}>Nombre:</label>
      <input id={id} type="text" />
    </div>
  );
}