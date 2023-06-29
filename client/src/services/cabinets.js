import axios from "axios";

let token = "";
const URL = "/api/cabinets";

const getConfig = () => ({
  headers: { Authorization: `Bearer ${token}` },
});
const setToken = (newToken) => {
  token = newToken;
};

const getCabinets = async () => {
  const response = await axios.get(URL, getConfig());
  return response.data;
};

const addCabinet = async (cabinetData) => {
  const response = await axios.post(URL, cabinetData, getConfig());
  return response.data;
};

const cabinetsService = { getCabinets, setToken, addCabinet };

export default cabinetsService;
