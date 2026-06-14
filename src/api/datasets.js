import API_URLS from './address';
import request, { requestMultipart } from './request';

export const uploadDataset = (formData) =>
  requestMultipart(API_URLS.DATASETS, 'POST', formData);

export const listDatasets = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`${API_URLS.DATASETS}${q ? '?' + q : ''}`, 'GET');
};

export const getDataset = (id) =>
  request(API_URLS.DATASET(id), 'GET');

export const updateDataset = (id, body) =>
  request(API_URLS.DATASET(id), 'PATCH', body);

export const deleteDataset = (id) =>
  request(API_URLS.DATASET(id), 'DELETE');

export const previewDataset = (id, params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`${API_URLS.DATASET_PREVIEW(id)}${q ? '?' + q : ''}`, 'GET');
};

export const getColumnStats = (id, col) =>
  request(API_URLS.DATASET_COLUMN(id, col), 'GET');
