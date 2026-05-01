import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ListTodosComponent from "./ListTodosComponent";
import {
  retrieveAllTodosWithUserNameApi,
  updateTodoApi,
} from "./api/TodoApiService";

jest.mock("./security/AuthContext", () => ({
  useAuth: () => ({ username: "admin" }),
}));

jest.mock("./api/TodoApiService", () => ({
  retrieveAllTodosWithUserNameApi: jest.fn(),
  deleteTodoApi: jest.fn(),
  updateTodoApi: jest.fn(),
}));

const todos = [
  {
    id: 1,
    username: "admin",
    description: "Learn Docker",
    done: false,
    targetDate: "2099-01-01",
    priority: "HIGH",
    category: "Learning",
  },
  {
    id: 2,
    username: "admin",
    description: "Buy groceries",
    done: true,
    targetDate: "2099-01-02",
    priority: "LOW",
    category: "Personal",
  },
];

function renderList() {
  retrieveAllTodosWithUserNameApi.mockResolvedValue({ data: todos });
  updateTodoApi.mockResolvedValue({});

  return render(
    <MemoryRouter>
      <ListTodosComponent />
    </MemoryRouter>
  );
}

test("renders dashboard stats and supports search", async () => {
  renderList();

  expect(await screen.findByText(/total: 2/i)).toBeInTheDocument();
  expect(screen.getByText(/completed: 1/i)).toBeInTheDocument();

  await userEvent.type(screen.getByPlaceholderText(/search todos/i), "docker");

  expect(screen.getByText(/learn docker/i)).toBeInTheDocument();
  expect(screen.queryByText(/buy groceries/i)).not.toBeInTheDocument();
});

test("filters completed todos", async () => {
  renderList();

  await screen.findByText(/learn docker/i);
  await userEvent.selectOptions(screen.getByDisplayValue(/all/i), "COMPLETED");

  await waitFor(() => {
    expect(screen.queryByText(/learn docker/i)).not.toBeInTheDocument();
  });
  expect(screen.getByText(/buy groceries/i)).toBeInTheDocument();
});
