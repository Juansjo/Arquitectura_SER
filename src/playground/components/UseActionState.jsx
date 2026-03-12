import { useActionState } from "react";

function action(prevState, formData) {
  const name = formData.get("name");
  return { message: "Hola " + name };
}

export default function UseActionState() {
  const [state, formAction] = useActionState(action, { message: "" });

  return (
    <form action={formAction}>
      <h2>useActionState</h2>
      <input name="name" placeholder="Nombre" />
      <button type="submit">Enviar</button>
      <p>{state.message}</p>
    </form>
  );
}