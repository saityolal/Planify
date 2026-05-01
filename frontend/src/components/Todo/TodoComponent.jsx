/* eslint-disable import/no-anonymous-default-export */
import { useNavigate, useParams } from "react-router-dom";
import { createTodoApi, retrieveTodoApi, updateTodoApi } from "./api/TodoApiService";
import { useAuth } from "./security/AuthContext";
import { useCallback, useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import moment from "moment";

const NEW_TODO_ID = "-1";

export default function TodoComponent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const authContext = useAuth();
  const username = authContext.username;
  const isNewTodo = id === NEW_TODO_ID;

  const [description, setDescription] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [done, setDone] = useState(false);
  const [priority, setPriority] = useState("MEDIUM");
  const [category, setCategory] = useState("");

  const retrieveTodo = useCallback(() => {
    if (!isNewTodo) {
      retrieveTodoApi(username, id)
        .then((response) => {
          setDescription(response.data.description);
          setTargetDate(response.data.targetDate);
          setDone(response.data.done);
          setPriority(response.data.priority || "MEDIUM");
          setCategory(response.data.category || "");
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [id, isNewTodo, username]);

  useEffect(() => retrieveTodo(), [retrieveTodo]); // reload when route id changes

  function onSubmit(values) {
    const todo = {
      // Field of the JSON object
      id: isNewTodo ? null : Number(id),
      username: username,
      description: values.description,
      targetDate: values.targetDate,
      done: values.done,
      priority: values.priority,
      category: values.category,
    };

    if (isNewTodo) {
      createTodoApi(username, todo)
        .then((response) => {
          console.log(response);
          navigate("/todos");
        })
        .catch((error) => console.log(error));
    } else {
      updateTodoApi(username, id, todo)
        .then((response) => {
          console.log(response);
          navigate("/todos");
        })
        .catch((error) => console.log(error));
    }
  }
  function validate(values) {
    let errors = {
      // description: "Enter valid description",
      // targetDate: "Enter valid target date"
    };
    if (values.description.length < 5) {
      errors.description = "Description must be at least 5 characters long";
    }
    if (!values.targetDate || isNaN(Date.parse(values.targetDate)) || !moment(values.targetDate).isValid()) {
      errors.targetDate = "Enter a valid target date";
    }

    return errors;
  }
  return (
    <div className="container form-page">
      <div className="app-card form-card">
        <p className="text-primary fw-semibold mb-2">{isNewTodo ? "New task" : "Edit task"}</p>
        <h1 className="fw-bold mb-4">{isNewTodo ? "Create a todo" : "Update your todo"}</h1>
        {/* We need to pass the initialValues here and reinitialize to true to refresh the form */}
        <Formik
          initialValues={{ description, targetDate, done, priority, category }}
          enableReinitialize={true}
          onSubmit={onSubmit}
          validate={validate}
          validateOnChange={false} // validate only on submit
          validateOnBlur={false} // validate only on blur
          // first validate called then onSubmit called unless it returns error
        >
          {(props) => (
            <Form>
              <ErrorMessage
                name="description"
                component="div"
                className="alert alert-warning"
              />
              <ErrorMessage
                name="targetDate"
                component="div"
                className="alert alert-warning"
              />
              <fieldset className="form-group">
                <label className="form-label fw-semibold">Description</label>
                <Field
                  type="text"
                  className="form-control"
                  name="description"
                />
              </fieldset>
              <fieldset className="form-group mt-3">
                <label className="form-label fw-semibold">Target Date</label>
                <Field type="date" className="form-control" name="targetDate" />
              </fieldset>
              <fieldset className="form-group mt-3">
                <label className="form-label fw-semibold">Priority</label>
                <Field as="select" className="form-control" name="priority">
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </Field>
              </fieldset>
              <fieldset className="form-group mt-3">
                <label className="form-label fw-semibold">Category</label>
                <Field
                  type="text"
                  className="form-control"
                  name="category"
                  placeholder="Work, Personal, Learning..."
                />
              </fieldset>
              <fieldset className="form-check mt-3">
                <Field
                  type="checkbox"
                  className="form-check-input"
                  name="done"
                  id="done"
                />
                <label className="form-check-label" htmlFor="done">
                  Completed
                </label>
              </fieldset>
              <div>
                <button className="btn btn-primary rounded-pill px-5 mt-4" type="submit">
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
