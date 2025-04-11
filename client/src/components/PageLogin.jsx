import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, attemptLoginWithToken } from "../api/index.js";
import { Input } from "./ui/input";

const PageLogin = ({ setIsLoggedIn, setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
      attemptLoginWithToken(setUser)
        .then((userData) => {
          if (userData) {
            setIsLoggedIn(true);
            navigate("/departments");
          }
        })
        .catch((error) => {
          console.error("Login attempt failed:", error);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUser(null);
        });
    }
  }, [navigate, setIsLoggedIn, setUser]);

  const submit = (ev) => {
    ev.preventDefault();
    setError("");
    login({ username, password }, (userData) => {
      setIsLoggedIn(true);
      setUser(userData);
      navigate("/departments");
    }).catch((err) => {
      setError(err.message || "Login failed");
    });
  };

  return (
    <div>
      <div className="hero bg-radial-[at_50%_75%] from-[#F3E4B5]/50 via-[#F4E3A5]/50 to-[#8CA28C]/50 to-90%"></div>
      <h1 className="text-2xl font-bold text-blue-900 my-6">Login</h1>
      <form
        onSubmit={submit}
        className="flex flex-col gap-4 max-w-[400px] bg-white/50 p-6 rounded-lg shadow-lg"
      >
        <Input
          value={username}
          type="text"
          placeholder="username"
          onChange={(ev) => setUsername(ev.target.value)}
          className="bg-white"
        />
        <Input
          value={password}
          type="password"
          placeholder="password"
          onChange={(ev) => setPassword(ev.target.value)}
          className="bg-white"
        />
        <div>
          <button
            className="text-white bg-blue-900 px-4 py-2 rounded-md"
            disabled={!username || !password}
          >
            Login
          </button>
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </div>
  );
};

export default PageLogin;
