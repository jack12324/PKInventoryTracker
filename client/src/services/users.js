import axios from "axios";

const url = "/api/users";

const create = async (user) => {
  const response = await axios.post(url, user);
  return response.data;
};

const usersService = { create };
export default usersService;
