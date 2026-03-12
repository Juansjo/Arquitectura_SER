import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function UseLayoutEffect() {

  const textRef = useRef();
  const navigate = useNavigate();

  useLayoutEffect(() => {
    textRef.current.style.color = "red";
    console.log("useLayoutEffect ejecutado");
  }, []);

  return (
    <div>
      <h2>useLayoutEffect</h2>

      <p ref={textRef}>
        Este texto cambia de color antes de renderizar
      </p>
<button onClick={() => navigate("/")}>Volver al Home</button>
    </div>
  );
}

export default UseLayoutEffect;