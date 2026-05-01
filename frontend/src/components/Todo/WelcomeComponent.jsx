import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./security/AuthContext";
import { retrieveHelloWorldPathVariable } from "./api/HelloWorldApiService";

function WelcomeComponent() {
  const { username: routeUsername } = useParams();

  const authContext = useAuth();
  const username = routeUsername || authContext.username;

  const [message, setMessage] = useState(null);

  function callHelloWorldRestApi() {
    retrieveHelloWorldPathVariable(username, authContext.token)
      .then((response) => successfulResponse(response))
      .catch((error) => errorResponse(error));
  }

  function successfulResponse(response) {
    setMessage(response.data.message);
  }

  function errorResponse(error) {
    console.log(error);
    setMessage("Could not reach the backend right now.");
  }

  return (
    <div className="container welcome-page">
      <div className="app-card welcome-hero">
        <div className="row align-items-center g-4">
          <div className="col-lg-7 text-start">
            <p className="text-primary fw-semibold mb-2">Home</p>
            <h1 className="welcome-title">Welcome back, {username}</h1>
            <p className="welcome-subtitle">
              Keep your day focused with clear priorities, categories, and due
              dates. Start with your task list or quickly check whether the
              backend connection is healthy.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link className="btn btn-primary btn-lg rounded-pill px-4" to="/todos">
                View Todos
              </Link>
              <button
                className="btn btn-outline-primary btn-lg rounded-pill px-4"
                onClick={callHelloWorldRestApi}
              >
                Test Backend
              </button>
            </div>
          </div>
          <div className="col-lg-5">
            <div className="welcome-summary-card">
              <span className="welcome-summary-icon">P</span>
              <h2 className="h4 fw-bold mt-3">Planify</h2>
              <p className="text-muted mb-0">
                A cleaner space to plan, track, and finish your tasks.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-4">
        <div className="col-md-4">
          <div className="app-card quick-card">
            <p className="quick-card-label">Plan</p>
            <h3>Organize priorities</h3>
            <p>Use priority and category fields to separate urgent work from routine tasks.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="app-card quick-card">
            <p className="quick-card-label">Track</p>
            <h3>Follow due dates</h3>
            <p>See what is pending, completed, overdue, or due today from the dashboard.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="app-card quick-card">
            <p className="quick-card-label">Focus</p>
            <h3>Filter fast</h3>
            <p>Search, sort, and filter your list so the next action is always clear.</p>
          </div>
        </div>
      </div>

      {message && <div className="backend-message mt-4">{message}</div>}
    </div>
  );
}

export default WelcomeComponent;
