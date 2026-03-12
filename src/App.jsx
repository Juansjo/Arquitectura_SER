import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeHooks from "../src/playground/Homehooks";
import UseState from "../src/playground/components/useState";
import UseEffect from "./playground/components/useEffect";
import { UserContext } from "./playground/context/userContext";
import UseContext from "./playground/components/usecontext";
import UseReducer from "./playground/components/useReducer";
import UseRef from "./playground/components/useRef";
import UseMemo from "./playground/components/useMemo";
import UseCallback from "./playground/components/useCallback";
import UseLayoutEffect from "./playground/components/useLayoutEffect";
import UseImperativeHandle from "./playground/components/useImperativeHandle";


function App() {
  return (

    <UserContext.Provider value={"Juan Pérez"}>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeHooks/>} />
        <Route path="/usestate" element={<UseState/>} />
        <Route path="/useeffect" element={<UseEffect/>} />
        <Route path="/" element={<HomeHooks/>} />
        <Route path="/usecontext" element={<UseContext/>} />
        <Route path="/usereducer" element={<UseReducer />} />
       <Route path="/useref" element={<UseRef />} />
         <Route path="/usememo" element={<UseMemo />} />
        <Route path="/usecallback" element={<UseCallback />} />
       <Route path="/uselayout" element={<UseLayoutEffect />} />
        <Route path="/useimperative" element={<UseImperativeHandle/>} />

      </Routes>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;