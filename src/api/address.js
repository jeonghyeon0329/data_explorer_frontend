const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const API_URLS = {
  SIGNUP: `${API_BASE_URL}/accounts/signup/`,
  FORGOT_PASSWORD: `${API_BASE_URL}/accounts/forgot-password/`,
  RESET_PASSWORD: `${API_BASE_URL}/accounts/reset-password/`,
  
};

export default API_URLS;
