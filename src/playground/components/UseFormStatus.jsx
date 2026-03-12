import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit">
      {pending ? "Enviando..." : "Enviar"}
    </button>
  );
}

export default function UseFormStatus() {
  return (
    <form>
      <h2>useFormStatus</h2>
      <input type="text" placeholder="Nombre" />
      <SubmitButton />
    </form>
  );
}