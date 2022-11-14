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

export const getUsers = async (page, size) => {
  const response = await axios.get("/api/1.0/users", {
    params: { page, size },
  });

  if (response.statusText !== "OK") {
    throw { message: "Failed to fetch users", status: 500 };
  }

  return response;
};
