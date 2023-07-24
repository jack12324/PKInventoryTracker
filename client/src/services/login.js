import axios from "axios";
import tokenHelper from "./tokenHelper";

const url = "/api/login";

const login = async (credentials) => {
  const response = await axios.post(url, credentials);
  return response.data;
};

const checkToken = async () => {
  const response = await axios.get(url, tokenHelper.getConfig());
  return response.data;
};

const loginService = { login, checkToken };

export default loginService;
