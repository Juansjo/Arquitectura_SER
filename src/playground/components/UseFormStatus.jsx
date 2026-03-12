import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit">
      {pending ? "Enviando..." : "Enviar"}
    </button>
  );
}

async function fakeSubmit() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
}

export default function UseFormStatus() {
  return (
    <form action={fakeSubmit}>
      <h2>useFormStatus</h2>

      <input type="text" placeholder="Nombre" />

      <SubmitButton />
    </form>
  );
}