import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomeHooks from "./playground/Homehooks";
import UseState from "./playground/components/useState";
import UseEffect from "./playground/components/useEffect";
import UseContext from "./playground/components/usecontext";


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
       {/* <Route path="/usereducer" element={<UseReducerExample />} />
        <Route path="/useref" element={<UseRefExample />} />
        <Route path="/usememo" element={<UseMemoExample />} />
        <Route path="/usecallback" element={<UseCallbackExample />} />
        <Route path="/uselayout" element={<UseLayoutEffectExample />} />
        <Route path="/useimperative" element={<UseImperativeHandleExample />} />*/}

    </Routes>
  </BrowserRouter>
</UserContext.Provider>


);
}

export default App;
