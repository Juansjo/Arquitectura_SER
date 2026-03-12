import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit">
      {pending ? "Enviando..." : "Enviar"}
    </button>
  );
}

async function action(prevState, formData) {
  const name = formData.get("name");

  await new Promise((r) => setTimeout(r, 2000));

  return { message: "Hola " + name };
}

export default function UseActionStateExample() {
  const [state, formAction] = useActionState(action, { message: "" });

  return (
    <form action={formAction}>
      <h2>useActionState</h2>

      <input name="name" placeholder="Nombre" />

      <SubmitButton />

      <p>{state.message}</p>
    </form>
  );
}