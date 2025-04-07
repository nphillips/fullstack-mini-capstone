import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Logo from "./components/Logo";

import PageDepList from "./components/PageDepList";
import PageDep from "./components/PageDep";

import PageProfList from "./components/PageProfList";
import PageProf from "./components/PageProf";

import PageLogin from "./components/PageLogin";
import PageReg from "./components/PageReg";

function App() {
  return (
    <BrowserRouter>
      <Logo />
      <main className="container">
        <Routes>
          <Route path="/" element={<PageDepList />} />
          <Route path="/departments" element={<PageDepList />} />
          <Route path="/departments/:id" element={<PageDep />} />
          <Route path="/professors" element={<PageProfList />} />
          <Route path="/professors/:id" element={<PageProf />} />
          <Route path="/login" element={<PageLogin />} />
          <Route path="/registration" element={<PageReg />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
