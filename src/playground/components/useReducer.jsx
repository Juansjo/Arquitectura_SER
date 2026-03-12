import { useReducer } from "react";
import { useNavigate } from "react-router-dom";


function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };

    case "decrement":
      return { count: state.count - 1 };

    default:
      return state;
  }
}

function UseReducer() {
    
const navigate = useNavigate();

  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <div>
      <h2>useReducer</h2>

      <p>Contador: {state.count}</p>

      <button onClick={() => dispatch({ type: "increment" })}>
        +
      </button>

      <button onClick={() => dispatch({ type: "decrement" })}>
        -
      </button>

      <br /><br />
      <button onClick={() => navigate("/")}>Volver al Home</button>
    </div>
  );
}

export default UseReducer;