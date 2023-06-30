let token = "";

const setToken = (newToken) => {
  token = newToken;
};

const getToken = () => token;

const getConfig = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

const tokenHelper = { setToken, getToken, getConfig };

export default tokenHelper;
