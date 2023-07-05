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

const deleteDrawer = async (id) => {
  const response = await axios.delete(`${URL}/${id}`, tokenHelper.getConfig());
  return response.data;
};

const updateDrawer = async (id, data) => {
  const response = await axios.put(
    `${URL}/${id}`,
    data,
    tokenHelper.getConfig()
  );
  return response.data;
};

const drawersService = { getDrawers, addDrawer, deleteDrawer, updateDrawer };

export default drawersService;
