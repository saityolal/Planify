import { Link } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

function HeaderComponent() {
  // const authContext = useContext(AuthContext)
  // console.log(authContext.number)

  const authContext = useAuth();
  const isAuthenticated = authContext.isAuthenticated;
  //console.log(AuthContext)

  function logout() {
    authContext.logout();
  }

  return (
    <header className="app-header sticky-top mb-5 py-3">
      <div className="container">
        <div className="row">
          <nav className="navbar navbar-expand-lg">
            <a
              className="navbar-brand ms-2 fs-4 fw-bold text-black d-flex align-items-center"
              href="https://github.com/saityolal/planify"
            >
              <span className="brand-mark">P</span>
              Planify
            </a>
            <div className="collapse navbar-collapse">
              <ul className="navbar-nav">
                <li className="nav-item fs-5">
                  {isAuthenticated && (
                    <Link className="nav-link fw-semibold" to="/welcome">
                      Home
                    </Link>
                  )}
                </li>
                <li className="nav-item fs-5">
                  {isAuthenticated && (
                    <Link className="nav-link fw-semibold" to="/todos">
                      Todos
                    </Link>
                  )}
                </li>
              </ul>
            </div>
            <ul className="navbar-nav">
              <li className="nav-item fs-5">
                {!isAuthenticated && (
                  <Link
                    className="btn btn-outline-primary rounded-pill px-4"
                    to="/login"
                  >
                    Login
                  </Link>
                )}
              </li>
              <li className="nav-item fs-5">
                {isAuthenticated && (
                  <Link
                    className="btn btn-primary rounded-pill px-4"
                    to="/logout"
                    onClick={logout}
                  >
                    Logout
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;
