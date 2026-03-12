import { useState, useDeferredValue } from "react";

function SlowList({ text }) {
  const items = [];

  for (let i = 0; i < 50; i++) {
    items.push(<div key={i}>{text}</div>);
  }

  return <div>{items}</div>;
}

export default function UseDeferredValue() {
  const [text, setText] = useState("");
  const deferredText = useDeferredValue(text);

  return (
    <div>
      <h2>useDeferredValue</h2>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <p>Normal: {text}</p>
      <p>Diferido: {deferredText}</p>

      <SlowList text={deferredText} />
    </div>
  );
}