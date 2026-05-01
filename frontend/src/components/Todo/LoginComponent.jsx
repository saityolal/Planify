import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

function LoginComponent() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");

  const [showErrorMessage, setErrorMessage] = useState(false);

  const navigate = useNavigate();

  const authContext = useAuth();

  function handleUsernameChange(event) {
    // console.log(event.target.value);
    setUsername(event.target.value);
  }

  function handlepasswordChange(event) {
    // console.log(event.target.value);
    setPassword(event.target.value);
  }

  async function handleSubmit() {
    if (await authContext.login(username, password)) {
      navigate(`/welcome/${username}`);
    } else {
      setErrorMessage(true);
    }
  }

  return (
    <div className="login-page">
      <div className="app-card login-card">
        <p className="text-primary fw-semibold mb-2">Welcome back</p>
        <h1 className="login-title">Plan your day with Planify</h1>
        <p className="login-subtitle">
          Track priorities, categories, and due dates from one clean workspace.
        </p>
        {showErrorMessage && (
          <div className="alert alert-danger">Login failed. Please try again.</div>
        )}
        <div className="mb-3">
          <label className="form-label fw-semibold">User Name</label>
          <input
            type="text"
            name="username"
            className="form-control form-control-lg"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="mb-4">
          <label className="form-label fw-semibold">Password</label>
          <input
            type="password"
            className="form-control form-control-lg"
            value={password}
            onChange={handlepasswordChange}
          />
        </div>
        <div className="d-grid">
          <button className="btn btn-primary btn-lg rounded-pill" type="button" onClick={handleSubmit}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
