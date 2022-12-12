const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN-SUCCESS":
      return {
        ...state,
        ...action.payload,
        isLoggedIn: true,
      };
    default:
      return state;
  }
};

export default authReducer;
