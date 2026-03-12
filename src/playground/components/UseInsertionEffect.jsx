import { useInsertionEffect } from "react";

export default function UseInsertionEffect() {

  useInsertionEffect(() => {
    console.log("Ejecutado antes del DOM");
  }, []);

  return (
    <div>
      <h2>useInsertionEffect</h2>
      <p>Revisa la consola</p>
    </div>
  );
}