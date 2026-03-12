import { useState, useTransition } from "react";

export default function UseTransition() {
  const [isPending, startTransition] = useTransition();
  const [text, setText] = useState("");

  const handleChange = (e) => {
    startTransition(() => {
      setText(e.target.value);
    });
  };

  return (
    <div>
      <h2>useTransition</h2>
      <input onChange={handleChange} />
      {isPending ? <p>Cargando...</p> : <p>{text}</p>}
    </div>
  );
}