import axios from "axios";
import tokenHelper from "./tokenHelper";

const URL = "/api/items";

const getItems = async () => {
  const response = await axios.get(URL, tokenHelper.getConfig());
  return response.data;
};

const addItem = async (drawerData) => {
  const response = await axios.post(URL, drawerData, tokenHelper.getConfig());
  return response.data;
};

const itemsService = { getItems, addItem };

export default itemsService;
