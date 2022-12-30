const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN-SUCCESS":
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true,
      };
    case "LOGOUT-SUCCESS":
      return {
        isLoggedIn: false,
      };
    case "USER-UPDATE-SUCCESS":
      return {
        ...state,
        username: action.payload.username,
      };
    default:
      return state;
  }
};

export default authReducer;
