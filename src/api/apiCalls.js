import axios from "axios";
import i18n from "../locale/i18n";

axios.interceptors.request.use((request) => {
  request.headers["Accept-Language"] = i18n.language;
  return request;
});

export const signup = (body) => {
  return axios.post("/api/1.0/users", body);
};

export const login = (body) => {
  return axios.post("/api/1.0/auth", body);
};

export const activate = (token) => {
  return axios.post("/api/1.0/users/token/" + token);
};

export const getUsers = async (page, size) => {
  const response = await axios.get("/api/1.0/users", {
    params: { page, size },
  });

  if (response.statusText !== "OK") {
    throw { message: "Failed to fetch users", status: 500 };
  }

  return response;
};

export const getUser = async (id) => {
  const response = await axios.get(`/api/1.0/users/${id}`);

  if (response.statusText !== "OK") {
    throw { message: `Failed to fetch the user under id ${id}`, status: 500 };
  }

  return response;
};

export const updateUser = async (id, username, header) => {
  const response = await axios.put(
    `/api/1.0/users/${id}`,
    {
      username: username,
    },
    {
      headers: {
        Authorization: header,
      },
    }
  );

  return response;
};
