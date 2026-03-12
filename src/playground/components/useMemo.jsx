import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

function UseMemo() {
  const [number, setNumber] = useState(0);
  const navigate = useNavigate();

  const double = useMemo(() => {
    console.log("Calculando...");
    return number * 2;
  }, [number]);

  return (
    <div>
      <h2>useMemo</h2>

      <p>Número: {number}</p>
      <p>Doble: {double}</p>

      <button onClick={() => setNumber(number + 1)}>
        Aumentar
      </button>

      <br /><br />
       <button onClick={() => navigate("/")}>
        Volver al Home
      </button>
    </div>
  );
}

export default UseMemo;