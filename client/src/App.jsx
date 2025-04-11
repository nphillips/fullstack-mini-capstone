import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { attemptLoginWithToken } from "./api";

import Nav from "./components/Nav";

import PageDepList from "./components/PageDepList";
import PageDep from "./components/PageDep";

import PageProfList from "./components/PageProfList";
import PageProf from "./components/PageProf";

import PageLogin from "./components/PageLogin";
import PageReg from "./components/PageReg";
import { useEffect, useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      attemptLoginWithToken(setUser)
        .then((userData) => {
          if (userData) {
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUser(null);
        });
    }
  }, []);

  return (
    <BrowserRouter>
      <Nav
        isLoggedIn={isLoggedIn}
        user={user}
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
      />

      <main className="container flex flex-col min-h-full ">
        <Routes>
          <Route path="/" element={<PageDepList />} />
          <Route path="/departments" element={<PageDepList />} />
          <Route path="/departments/:name" element={<PageDep />} />
          <Route path="/professors" element={<PageProfList />} />
          <Route path="/professors/:id" element={<PageProf />} />
          <Route
            path="/login"
            element={
              <PageLogin setIsLoggedIn={setIsLoggedIn} setUser={setUser} />
            }
          />
          <Route path="/registration" element={<PageReg />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
