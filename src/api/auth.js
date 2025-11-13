import API_URLS from './address';
import request from './request';
  
export const signup = async (username, name, email, password) => {
  return await request(API_URLS.SIGNUP, 'POST', { username, name, email, password});
};

export const reset_password = async (email) => {
  return await request(API_URLS.RESET_PASSWORD, 'POST', {email});
};