import { useFormState } from "react-dom";

async function submitForm(prevState, formData) {
  const name = formData.get("name");
  return { message: `Hola ${name}` };
}

export default function UseFormState() {
  const [state, formAction] = useFormState(submitForm, { message: "" });

  return (
    <form action={formAction}>
      <h2>useFormState</h2>

      <input name="name" placeholder="Nombre" />

      <button type="submit">Enviar</button>

      <p>{state.message}</p>
    </form>
  );
}