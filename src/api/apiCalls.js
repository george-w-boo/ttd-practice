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

export const getUsersAxios = async () => {
  const response = await axios.get(
    "https://dummyjson.com/users?limit=20&skip=10&select=firstName,email,image"
  );

  if (response.statusText !== "OK") {
    throw { message: "Failed to fetch users", status: 500 };
  }

  return response;
};

export async function getUsersFetch() {
  const response = await fetch(
    "https://dummyjson.com/users?limit=100&skip=10&select=firstName,age"
  );

  if (!response.ok) {
    throw { message: "Failed to fetch users", status: 500 };
  }

  return response.json();
}
