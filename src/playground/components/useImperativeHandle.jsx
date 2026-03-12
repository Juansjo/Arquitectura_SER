import { useRef, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";

const Child = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    sayHello() {
      alert("Hola desde el hijo!");
    }
  }));

  return <p>Componente hijo</p>;
});

function UseImperativeHandle() {
  const childRef = useRef();
  const navigate = useNavigate();

  return (
    <div>
      <h2>useImperativeHandle</h2>

      <Child ref={childRef} />

      <button onClick={() => childRef.current.sayHello()}>
        Ejecutar función del hijo
      </button>

    
    <br/><button onClick={() => navigate("/")}>
        Volver al Home
      </button><br/>
    </div>
  );
}

export default UseImperativeHandle;