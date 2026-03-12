import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

function UseCallback() {
  const [count, setCount] = useState(0);
const navigate = useNavigate();
  const increment = useCallback(() => {
    console.log("Función increment creada");
    setCount((prev) => prev + 1);
  }, []);

  return (
    <div>
      <h2>useCallback</h2>

      <p>Contador: {count}</p>

      <button onClick={increment}>
        Incrementar
      </button>
       <button onClick={() => navigate("/")}>Volver al Home</button>
    </div>
  );
}

export default UseCallback;