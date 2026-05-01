# Planify

Planify is a full-stack task planning application with a React frontend and Spring Boot backend.

## Features

- JWT login and protected todo routes.
- Todo CRUD with description, target date, completion status, priority, and category.
- Dashboard cards for total, completed, pending, overdue, and due-today todos.
- Search, filter, sort, and quick completion toggle.
- Polished Bootstrap-based UI for login, home, todo list, todo form, and logout screens.
- Backend ownership checks, request validation, profile-based configuration, and focused tests.

## Tech Stack

- Frontend: React 18, Create React App, React Router, Axios, Formik, Bootstrap.
- Backend: Java 21, Spring Boot 3.4, Spring Web, Spring Security, OAuth2 Resource Server JWT, Spring Data JPA.
- Database: H2 in development, configurable datasource for production.
- Tests: React Testing Library, Jest, Spring Boot Test, Spring Security Test.

## Project Structure

```text
todo-app/
  frontend/                         React application
  backend/restfulwebservices/        Spring Boot API
```

## Getting Started

### Prerequisites

- Node.js and npm
- Java 21
- Maven is optional because the backend includes Maven Wrapper

### Backend

```powershell
cd backend/restfulwebservices
.\mvnw.cmd spring-boot:run
```

Backend runs at:

```text
http://localhost:5000
```

Development profile uses H2 by default. H2 console:

```text
http://localhost:5000/h2-console
```

### Frontend

```powershell
cd frontend
npm install
npm.cmd start
```

Use `npm.cmd start` on Windows PowerShell if `npm start` is blocked by execution policy.

Frontend runs at:

```text
http://localhost:3000
```

## Environment Variables

Frontend API base URL can be configured with:

```text
REACT_APP_API_BASE_URL=http://localhost:5000
```

See:

```text
frontend/.env.example
```

Backend supports these variables:

```text
APP_CORS_ALLOWED_ORIGINS=http://localhost:3000
APP_ADMIN_USERNAME=admin
APP_ADMIN_PASSWORD=admin
SPRING_DATASOURCE_URL=...
SPRING_DATASOURCE_USERNAME=...
SPRING_DATASOURCE_PASSWORD=...
```

Default development login:

```text
username: admin
password: admin
```

## Useful Commands

Frontend tests:

```powershell
cd frontend
npm test -- --watchAll=false
```

Frontend production build:

```powershell
cd frontend
npm run build
```

Backend tests:

```powershell
cd backend/restfulwebservices
.\mvnw.cmd test
```

## API Overview

Authentication:

```text
POST /authenticate
```

Todo endpoints:

```text
GET    /users/{username}/todos
GET    /users/{username}/todos/{id}
POST   /users/{username}/todos
PUT    /users/{username}/todos/{id}
DELETE /users/{username}/todos/{id}
```

All todo endpoints require a valid Bearer token. The backend checks that the path username matches the authenticated user.

## Notes

- `dev` profile is the default profile and uses in-memory H2.
- `prod` profile expects external datasource and secret values from environment variables.
- Do not commit real `.env` files or production secrets.
