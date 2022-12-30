import { AUTH } from "./Constants";

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH.LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true,
      };
    case AUTH.LOGOUT_SUCCESS:
      return {
        isLoggedIn: false,
      };
    case AUTH.USER_UPDATE_SUCCESS:
      return {
        ...state,
        username: action.payload.username,
      };
    default:
      return state;
  }
};

export default authReducer;
