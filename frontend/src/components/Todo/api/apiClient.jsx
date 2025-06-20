import axios from "axios";

export const apiClient = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "http://todo-app-env-1.eba-6uc7makf.eu-north-1.elasticbeanstalk.com/",
});
