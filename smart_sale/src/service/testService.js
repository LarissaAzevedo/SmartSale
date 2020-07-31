import request from "./request";

const api = new request();

const getAll = (query) => {
  const result = api.get("/", query);
  console.log("result :>> ", result);
  return result;
};

export const testService = {
  getAll,
};