const authReducer = (state, action) => {
  console.log({ state, action });

  switch (action.type) {
    case "LOGIN-SUCCESS":
      return {
        ...state,
        id: action.payload.id,
        isLoggedIn: true,
      };
    default:
      return state;
  }
};

export default authReducer;
