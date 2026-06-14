import API_URLS from './address';
import request from './request';

export const listUsers = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`${API_URLS.ADMIN_USERS}${q ? '?' + q : ''}`, 'GET');
};

export const updateUser = (id, body) =>
  request(API_URLS.ADMIN_USER(id), 'PATCH', body);

export const deleteUser = (id) =>
  request(API_URLS.ADMIN_USER(id), 'DELETE');

export const listAllDatasets = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`${API_URLS.ADMIN_DATASETS}${q ? '?' + q : ''}`, 'GET');
};
