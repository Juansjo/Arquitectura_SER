import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeHooks from "./playground/Homehooks";
import UseState from "./playground/components/useState";
import UseEffect from "./playground/components/useEffect";
import UseContext from "./playground/components/usecontext";
import UseDebugValue from "./playground/components/useDebugValue";
import UseId from "./playground/components/UseId";
import UseDeferredValue from "./playground/components/UseDeferredValue";
import UseSyncExternalStore from "./playground/components/UseSyncExternalStore";
import UseInsertionEffect from "./playground/components/UseInsertionEffect";
import UseOptimistic from "./playground/components/UseOptimistic";
import UseFormStatus from "./playground/components/UseFormStatus";
import UseFormState from "./playground/components/UseFormState";
import UseActionState from "./playground/components/UseActionState";
import UseTransition from "./playground/components/UseTransition";

import { UserContext } from "./playground/context/userContext";

function App() {
return (
<UserContext.Provider value={"Juan Pérez"}> <BrowserRouter> <Routes>

      <Route path="/" element={<HomeHooks />} />
      <Route path="/usestate" element={<UseState />} />
      <Route path="/useeffect" element={<UseEffect />} />
      <Route path="/usecontext" element={<UseContext />} />
      <Route path="/usedebugvalue" element={<UseDebugValue />} />
      <Route path="/useid" element={<UseId />} />
      <Route path="/usetransition" element={<UseTransition />} />
      <Route path="/usedeferredvalue" element={<UseDeferredValue />} />
      <Route path="/usesyncexternalstore" element={<UseSyncExternalStore />} />
      <Route path="/useinsertioneffect" element={<UseInsertionEffect />} />
      <Route path="/useoptimistic" element={<UseOptimistic />} />
      <Route path="/useformstatus" element={<UseFormStatus />} />
      <Route path="/useformstate" element={<UseFormState />} />
      <Route path="/useactionstate" element={<UseActionState />} />

      <Route path="/useid" element={<UseId />} />
      <Route path="/usetransition" element={<UseTransition />} />

    </Routes>
  </BrowserRouter>
</UserContext.Provider>


);
}

export default App;
