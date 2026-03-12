import { useState, useEffect } from "react";

function UseEffect() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Contador: ${count}`;
  }, [count]);

  return (
    <div>
      <h2>useEffect</h2>
      <p>El título del navegador cambia con el contador.</p>

      <p>Contador: {count}</p>
      <button onClick={() => setCount(count + 1)}>Aumentar</button>

      <br /><br />
      <button onClick={() => window.history.back()}>Volver</button>
    </div>
  );
}

export default UseEffect;