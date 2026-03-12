import { useState, useOptimistic } from "react";

export default function UseOptimistic() {
  const [comments, setComments] = useState([]);

  const [optimisticComments, addOptimistic] = useOptimistic(
    comments,
    (state, newComment) => [...state, newComment]
  );

  const addComment = () => {
    const text = "Nuevo comentario";
    addOptimistic(text);

    setTimeout(() => {
      setComments((prev) => [...prev, text]);
    }, 2000);
  };

  return (
    <div>
      <h2>useOptimistic</h2>
      <button onClick={addComment}>Agregar</button>

      {optimisticComments.map((c, i) => (
        <p key={i}>{c}</p>
      ))}
    </div>
  );
}