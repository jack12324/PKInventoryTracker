import axios from "axios";
import tokenHelper from "./tokenHelper";

const URL = "/api/drawers";

const getDrawers = async () => {
  const response = await axios.get(URL, tokenHelper.getConfig());
  return response.data;
};

const addDrawer = async (drawerData) => {
  const response = await axios.post(URL, drawerData, tokenHelper.getConfig());
  return response.data;
};

const drawersService = { getDrawers, addDrawer };

export default drawersService;
