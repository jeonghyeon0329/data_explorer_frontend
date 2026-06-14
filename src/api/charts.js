import API_URLS from './address';
import request from './request';

export const createChart = (datasetId, body) =>
  request(API_URLS.DATASET_CHARTS(datasetId), 'POST', body);

export const listCharts = (datasetId) =>
  request(API_URLS.DATASET_CHARTS(datasetId), 'GET');

export const getChartData = (datasetId, chartId) =>
  request(API_URLS.CHART(datasetId, chartId), 'GET');

export const deleteChart = (datasetId, chartId) =>
  request(API_URLS.CHART(datasetId, chartId), 'DELETE');
