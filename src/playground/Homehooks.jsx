import { Link } from "react-router-dom";

function HomeHooks() {

  const hooks = [
    {
      name: "useState",
      description: "Permite manejar estado dentro de un componente.",
      category: "State",
      path: "/usestate"
    },
    {
      name: "useEffect",
      description: "Permite ejecutar efectos secundarios.",
      category: "Lifecycle",
      path: "/useeffect"
    },
    {
      name: "useContext",
      description: "Permite compartir datos globalmente.",
      category: "Context",
      path: "/usecontext"
    },
    {
      name: "useReducer",
      description: "Manejo de estado complejo.",
      category: "State",
      path: "/usereducer"
    },
    {
      name: "useRef",
      description: "Permite referenciar elementos del DOM.",
      category: "Reference",
      path: "/useref"
    },
    {
      name: "useMemo",
      description: "Optimiza cálculos costosos.",
      category: "Performance",
      path: "/usememo"
    },
    {
      name: "useCallback",
      description: "Memoriza funciones.",
      category: "Performance",
      path: "/usecallback"
    },
    {
      name: "useLayoutEffect",
      description: "Similar a useEffect pero antes del render.",
      category: "Lifecycle",
      path: "/uselayout"
    },
    {
      name: "useImperativeHandle",
      description: "Permite exponer métodos desde un componente hijo.",
      category: "Advanced",
      path: "/useimperative"
    }
  ];

  return (
    <div>
      <h1>Playground Hooks React</h1>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Hook</th>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Ejemplo</th>
          </tr>
        </thead>

        <tbody>
          {hooks.map((hook) => (
            <tr key={hook.name}>
              <td>{hook.name}</td>
              <td>{hook.description}</td>
              <td>{hook.category}</td>
              <td>
                <Link to={hook.path}>
                  Ver ejemplo
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HomeHooks;