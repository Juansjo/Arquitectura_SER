# Playground de Hooks en React

## Integrantes

* Juan José Pérez Gómez - 191923

* Juan Diego Arevalo Arevalo - 191983

---

## Explicación del código de los Hooks

### useState

En este componente, se utiliza `useState` para crear una variable de estado llamada `count`. Esta variable guarda el valor del contador. Se actualiza cuando el usuario presiona los botones para aumentar o disminuir el valor.

### useEffect

Aquí se usa `useEffect` para ejecutar una función cada vez que cambia el valor del contador. Dentro del efecto, se actualiza el título del navegador con `document.title`. Esto muestra cómo ejecutar código cuando cambia el estado del componente.

### useContext

Se crea un contexto llamado `UserContext`. Este contexto comparte información entre componentes. El componente usa `useContext` para acceder al valor proporcionado por el `Provider` y mostrarlo en pantalla.

### useReducer

Se define una función `reducer` que controla cómo cambia el estado según la acción enviada. Luego, `useReducer` maneja el estado del contador con acciones como `increment` y `decrement`.

### useRef

En este componente, se crea una referencia con `useRef` que se conecta a un elemento `input`. Cuando se presiona el botón, se accede al elemento con `ref.current` y se ejecuta el método `focus()`. Esto coloca el cursor en el campo de texto.

### useMemo

Se utiliza `useMemo` para memorizar el resultado de un cálculo basado en una variable de estado. El valor solo se vuelve a calcular cuando cambia la dependencia especificada. Esto evita ejecuciones innecesarias del cálculo.

### useCallback

Aquí se utiliza `useCallback` para memorizar una función que incrementa el contador. Esto evita que la función se cree de nuevo en cada renderizado del componente. Es útil cuando se pasan funciones a componentes hijos.

### useLayoutEffect

Se utiliza `useLayoutEffect` para ejecutar código justo después de que React hace cambios en el DOM. Esto sucede antes de que el navegador muestre los cambios en pantalla. En el ejemplo, se modifica el estilo de un elemento con una referencia.

### useImperativeHandle

En este ejemplo, se utiliza `useImperativeHandle` con `forwardRef`. Esto permite que un componente padre ejecute una función definida dentro de un componente hijo a través de una referencia.