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
},
{
name: "useDebugValue",
description: "Muestra información en React DevTools.",
category: "Advanced",
path: "/usedebugvalue"
},
{
name: "UseId",
description: "Genera IDs únicos.",
category: "Utility",
path: "/UseId"
},
{
name: "useTransition",
description: "Actualizaciones no urgentes.",
category: "Performance",
path: "/usetransition"
},
{
name: "useDeferredValue",
description: "Retrasa actualización de valores.",
category: "Performance",
path: "/usedeferredvalue"
},
{
name: "useSyncExternalStore",
description: "Suscribirse a datos externos.",
category: "Advanced",
path: "/usesyncexternalstore"
},
{
name: "useInsertionEffect",
description: "Se ejecuta antes de insertar cambios en el DOM.",
category: "Lifecycle",
path: "/useinsertioneffect"
},
{
name: "useOptimistic",
description: "Actualizaciones optimistas en la UI.",
category: "Advanced",
path: "/useoptimistic"
},
{
name: "useFormStatus",
description: "Estado de envío de formularios.",
category: "Forms",
path: "/useformstatus"
},
{
name: "useFormState",
description: "Controla estado de formularios.",
category: "Forms",
path: "/useformstate"
},
{
name: "useActionState",
description: "Estado de acciones en formularios.",
category: "Forms",
path: "/useactionstate"
}
];

return ( <div> <h1>Playground Hooks React</h1>


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
            <Link to={hook.path}>Ver ejemplo</Link>
          </td>
        </tr>
      ))}
    </tbody>

  </table>
</div>


);
}

export default HomeHooks;
