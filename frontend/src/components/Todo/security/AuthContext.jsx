import { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "../api/apiClient";
import { executeJwtAuthenticationService } from "../api/AuthenticationApiService";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AUTH_STORAGE_KEY = "todo-app-auth";

/**
 * Provides an authentication context for the application.
 *
 * The context provides the following properties:
 * - `isAuthenticated`: a boolean indicating whether the user is authenticated
 * - `login`: a function that takes a username and password and returns a boolean indicating whether the
 *   authentication was successful
 * - `logout`: a function that logs the user out
 * - `username`: the username of the authenticated user
 * - `token`: the authentication token
 */

function AuthProvider({ children }) {
  const storedAuth = JSON.parse(sessionStorage.getItem(AUTH_STORAGE_KEY) || "null");
  const [isAuthenticated, setAuthenticated] = useState(Boolean(storedAuth?.token));

  //setInterval(() =>setNumber(number+1), 1000);
  //const valueToBeShared = { number, isAuthenticated, setAuthenticated };

  const [username, setUsername] = useState(storedAuth?.username || null);
  const [token, setToken] = useState(storedAuth?.token || null);
  // function login(username, password) {
  //   if (username === "admin" && password === "admin") {
  //     setAuthenticated(true);
  //     setUsername(username);
  //     return true;
  //   } else {
  //     setAuthenticated(false);
  //     setUsername(null);
  //     return false;
  //   }
  // }

  // async function login(username, password) {
  //   const baToken = "Basic " + window.btoa(username + ":" + password);

  //   try {
  //     const response = await executeBasicAuthenticationService(baToken);

  //     if (response.status === 200) {
  //       setAuthenticated(true);
  //       setUsername(username);
  //       setToken(baToken);
  //       apiClient.interceptors.request.use((config) => {
  //         console.log("intercepted request adding a token");
  //         config.headers.Authorization = baToken;
  //         return config;
  //       });
  //       return true;
  //     } else {
  //       logout();
  //       return false;
  //     }
  //   } catch (error) {
  //     logout();
  //     return false;
  //   }
  // }
  async function login(username, password) {
    try {
      const response = await executeJwtAuthenticationService(
        username,
        password
      );
      if (response.status === 200) {
        const jwtToken = "Bearer " + response.data.token;
        setAuthenticated(true);
        setUsername(username);
        setToken(jwtToken);
        sessionStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({ username, token: jwtToken })
        );
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      logout();
      return false;
    }
  }

  function logout() {
    setToken(null);
    setUsername(null);
    setAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }

  useEffect(() => {
    const interceptorId = apiClient.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = token;
      } else {
        delete config.headers.Authorization;
      }
      return config;
    });

    return () => apiClient.interceptors.request.eject(interceptorId);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, username, token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
