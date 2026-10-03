export const countpluse = (links) => {
  return {
    type: "COUNT_PLUS",
    payload: links,
  };
};

export const clickplus = (links) => {
  return {
    type: "COUNT_CLICK",
    payload: links,
  };
};
