import axios from "axios";
import tokenHelper from "./tokenHelper";

const URL = "/api/cabinets";

const getCabinets = async () => {
  const response = await axios.get(URL, tokenHelper.getConfig());
  return response.data;
};

const addCabinet = async (cabinetData) => {
  const response = await axios.post(URL, cabinetData, tokenHelper.getConfig());
  return response.data;
};

const deleteCabinet = async (id) => {
  const response = await axios.delete(`${URL}/${id}`, tokenHelper.getConfig());
  return response.data;
};

const updateCabinet = async (id, name) => {
  const response = await axios.put(
    `${URL}/${id}`,
    { name },
    tokenHelper.getConfig()
  );
  return response.data;
};

const cabinetsService = {
  getCabinets,
  addCabinet,
  deleteCabinet,
  updateCabinet,
};

export default cabinetsService;
