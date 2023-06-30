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

const cabinetsService = { getCabinets, addCabinet };

export default cabinetsService;
