import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("axios", () => ({
  create: () => ({
    interceptors: {
      request: {
        use: jest.fn(),
        eject: jest.fn(),
      },
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }),
}));

test("renders the login screen", () => {
  render(<App />);
  expect(screen.getByText(/user name/i)).toBeInTheDocument();
});
