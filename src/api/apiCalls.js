import axios from "axios";

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
