import axios from "axios";

export const signup = (body, language) => {
  return axios.post("/api/1.0/users", body, {
    headers: {
      "Accept-Language": language,
    },
  });
};
