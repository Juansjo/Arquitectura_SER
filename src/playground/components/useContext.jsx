import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

function UseContext() {

  const user = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <div>
      <h2>useContext</h2>

      <p>Usuario desde contexto: {user}</p>

      <button onClick={() => navigate("/")}>
        Volver al Home
      </button>
    </div>
  );
}

export default UseContext;