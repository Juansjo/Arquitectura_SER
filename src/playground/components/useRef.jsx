import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function UseRef() {
  const inputRef = useRef();
  const navigate = useNavigate();

  const focusInput = () => {
    inputRef.current.focus();
  };

  return (
    <div>
      <h2>useRef</h2>

      <input ref={inputRef} placeholder="Escribe algo..." />

      <br /><br />
      <button onClick={focusInput}>Enfocar input</button>

      <br /><br />
     <button onClick={() => navigate("/")}>Volver al Home</button>
    </div>
  );
}

export default UseRef;