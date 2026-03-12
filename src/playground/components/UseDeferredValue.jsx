import { useState, useDeferredValue } from "react";

export default function UseDeferredValue() {
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);

  return (
    <div>
      <h2>useDeferredValue</h2>
      <input onChange={(e) => setText(e.target.value)} />
      <p>Normal: {text}</p>
      <p>Diferido: {deferredText}</p>
    </div>
  );
}