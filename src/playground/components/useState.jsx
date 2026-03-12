import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UseStateExample() {

  const [count, setCount] = useState(0);
  
const navigate = useNavigate();
  return (
    <div>
      <h2>useState</h2>
      <p>Contador: {count}</p>

      <button onClick={() => setCount(count + 1)}>Sumar</button>
      <button onClick={() => setCount(count - 1)}>Restar</button>

      <br /><br />
      <button onClick={() => navigate("/")}>Volver al Home</button>
    </div>
  );
}

export default UseStateExample;