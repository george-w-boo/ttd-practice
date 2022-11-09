import axios from "axios";
import { json } from "react-router-dom";

export const signup = (body, language) => {
  return axios.post("/api/1.0/users", body, {
    headers: {
      "Accept-Language": language,
    },
  });
};

export const activate = (token) => {
  return axios.post("/api/1.0/users/token/" + token);
};

export const getUsers = async () => {
  const response = await axios.get(
    "https://dummyjson.com/users?limit=100&skip=10&select=firstName,age"
  );

  if (response.statusText === "OK") {
    return response.data;
  }

  throw response;
};
