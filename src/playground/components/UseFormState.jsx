import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit">
      {pending ? "Enviando..." : "Enviar"}
    </button>
  );
}

function UseFormStatus() {
  return (
    <div>
      <h2>Ejemplo useFormStatus</h2>

      <form>
        <input type="text" placeholder="Nombre" />
        <SubmitButton />
      </form>
    </div>
  );
}

export default UseFormStatus;