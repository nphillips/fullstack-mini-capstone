import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, attemptLoginWithToken } from "../api/index.js";

const PageLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [auth, setAuth] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    attemptLoginWithToken(setAuth);
  }, []);

  const submit = (ev) => {
    ev.preventDefault();
    setError("");
    login({ username, password }, setAuth)
      .then(() => {
        navigate("/departments");
      })
      .catch((err) => {
        setError(err.message || "Login failed");
      });
  };

  return (
    <>
      <h1>Login</h1>
      <form
        onSubmit={submit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: ".125rem",
          maxWidth: "300px",
          boxShadow:
            "0px 1px 1px rgba(3, 7, 18, 0.02),0px 5px 4px rgba(3, 7, 18, 0.03),0px 12px 9px rgba(3, 7, 18, 0.05),0px 20px 15px rgba(3, 7, 18, 0.06),0px 32px 24px rgba(3, 7, 18, 0.08)",
          borderRadius: ".5rem",
          padding: "1rem",
        }}
      >
        <h2>Register</h2>
        <input
          value={username}
          type="text"
          placeholder="username"
          onChange={(ev) => setUsername(ev.target.value)}
          style={{
            padding: ".5rem",
            borderRadius: ".25rem",
            border: "1px solid #ccc",
          }}
        />
        <input
          value={password}
          type="password"
          placeholder="password"
          onChange={(ev) => setPassword(ev.target.value)}
          style={{
            padding: ".5rem",
            borderRadius: ".25rem",
            border: "1px solid #ccc",
          }}
        />
        <div>
          <button className="text-white" disabled={!username || !password}>
            Register
          </button>
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>
    </>
  );
};

export default PageLogin;
