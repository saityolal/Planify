// cimport axios from "axios";
import { apiClient } from "./apiClient";

// const apiClient = axios.create({
//   baseURL: "http://localhost:5000",
// });

export function retrieveHelloWorldBean() {
  return apiClient.get("/hello-world-bean");
}

export const retrieveHelloWorldPathVariable = (username, token) =>
  apiClient.get(`/hello-world/path-variable/${username}`);
