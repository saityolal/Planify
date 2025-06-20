
import { apiClient } from "./apiClient";


// export function retrieveUsers() {
//   return apiClient.get("http://localhost:8080/users");
// }

export const retrieveAllTodosWithUserNameApi = (username) =>
  apiClient.get(`/users/${username}/todos`);


export const deleteTodoApi = (username, id) =>
  apiClient.delete(`/users/${username}/todos/${id}`);

export const retrieveTodoApi = (username, id) =>
  apiClient.get(`/users/${username}/todos/${id}`);

export const updateTodoApi = (username, id, todo) =>
  apiClient.put(`/users/${username}/todos/${id}`, todo);

export const createTodoApi = (username, todo) =>
  apiClient.post(`/users/${username}/todos`, todo);
