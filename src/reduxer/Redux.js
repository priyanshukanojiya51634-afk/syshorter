const intalState = 0;
const reducer = (state = intalState, action) => {
  if (action.type === "COUNT_PLUS") {
    return state + 1;
  } else {
    return state;
  }
};

export const clickplus = (state = intalState, action) => {
  if (action.type === "CLICK_PLUS") {
    return state + 1;
  } else {
    return state;
  }
};

export default reducer;
