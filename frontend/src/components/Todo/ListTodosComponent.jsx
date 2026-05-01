import { useCallback, useEffect, useState } from "react";
import {
  retrieveAllTodosWithUserNameApi,
  deleteTodoApi,
  updateTodoApi,
} from "./api/TodoApiService";
import { useAuth } from "./security/AuthContext";
import { useNavigate } from "react-router-dom";

function ListTodosComponent() {
  const authContext = useAuth();
  const username = authContext.username;

  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("TARGET_DATE_ASC");

  const navigate = useNavigate();
  const refreshTodos = useCallback(() => {
    retrieveAllTodosWithUserNameApi(username)
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [username]);

  useEffect(() => refreshTodos(), [refreshTodos]);

  function deleteTodo(id) {
    deleteTodoApi(username, id)
      .then(() => {
        setMessage(`Delete of todo id ${id} successful`);
        refreshTodos();
      })
      .catch((error) => console.error(error));
  }
  function updateTodo(id) {
    navigate(`/todos/${id}`);
  }

  function addNewTodo() {
    navigate(`/todos/-1`);
  }

  function toggleTodoDone(todo) {
    const updatedTodo = { ...todo, done: !todo.done };

    updateTodoApi(username, todo.id, updatedTodo)
      .then(() => refreshTodos())
      .catch((error) => console.error(error));
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isOverdue = (todo) => {
    if (todo.done || !todo.targetDate) {
      return false;
    }

    return new Date(todo.targetDate) < today;
  };

  const stats = {
    total: todos.length,
    completed: todos.filter((todo) => todo.done).length,
    pending: todos.filter((todo) => !todo.done).length,
    overdue: todos.filter(isOverdue).length,
    dueToday: todos.filter((todo) => {
      if (!todo.targetDate) {
        return false;
      }

      return new Date(todo.targetDate).toDateString() === today.toDateString();
    }).length,
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "COMPLETED") {
        return todo.done;
      }
      if (filter === "PENDING") {
        return !todo.done;
      }
      if (filter === "OVERDUE") {
        return isOverdue(todo);
      }
      return true;
    })
    .filter((todo) =>
      todo.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((firstTodo, secondTodo) => {
      if (sortBy === "DESCRIPTION_ASC") {
        return firstTodo.description.localeCompare(secondTodo.description);
      }
      if (sortBy === "PRIORITY_DESC") {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return (
          (priorityOrder[secondTodo.priority] || 0) -
          (priorityOrder[firstTodo.priority] || 0)
        );
      }

      return new Date(firstTodo.targetDate) - new Date(secondTodo.targetDate);
    });

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="text-start">
          <p className="text-primary fw-semibold mb-1">Your workspace</p>
          <h1 className="fw-bold mb-0">Todo Dashboard</h1>
        </div>
        <button className="btn btn-primary rounded-pill px-4 py-2" onClick={addNewTodo}>
          Add New Todo
        </button>
      </div>
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="dashboard-card bg-primary-subtle p-3">Total: {stats.total}</div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-card bg-success-subtle p-3">Completed: {stats.completed}</div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-card bg-warning-subtle p-3">Pending: {stats.pending}</div>
        </div>
        <div className="col-md-3">
          <div className="dashboard-card bg-danger-subtle p-3">Overdue: {stats.overdue}</div>
        </div>
      </div>
      <div className="alert alert-info rounded-4 border-0">Due today: {stats.dueToday}</div>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="todo-toolbar row mb-4 g-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Search todos"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="ALL">All</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-control"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="TARGET_DATE_ASC">Target Date</option>
            <option value="DESCRIPTION_ASC">Description</option>
            <option value="PRIORITY_DESC">Priority</option>
          </select>
        </div>
      </div>
      <table className="table todo-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Done</th>
            <th>Priority</th>
            <th>Category</th>
            <th>Target Date</th>
            <th>Delete</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          {filteredTodos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.description}</td>
              <td>
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodoDone(todo)}
                />
              </td>
              <td>
                <span className={`priority-pill priority-${todo.priority || "MEDIUM"}`}>
                  {todo.priority || "MEDIUM"}
                </span>
              </td>
              <td>{todo.category || "-"}</td>
              <td>{todo.targetDate.toString()}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </td>
              <td>
                <button
                  className="btn btn-success"
                  onClick={() => updateTodo(todo.id)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListTodosComponent;
