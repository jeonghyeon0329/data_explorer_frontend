const BASE = process.env.REACT_APP_API_BASE_URL;

const API_URLS = {
  // 인증
  SIGNUP:          `${BASE}/accounts/signup/`,
  LOGIN:           `${BASE}/accounts/login/`,
  FORGOT_PASSWORD: `${BASE}/accounts/forgot-password/`,
  RESET_PASSWORD:  `${BASE}/accounts/reset-password/`,

  // 데이터셋
  DATASETS:        `${BASE}/datasets/`,
  DATASET:         (id)       => `${BASE}/datasets/${id}`,
  DATASET_PREVIEW: (id)       => `${BASE}/datasets/${id}/preview`,
  DATASET_COLUMN:  (id, col)  => `${BASE}/datasets/${id}/columns/${col}`,
  DATASET_CHARTS:  (id)       => `${BASE}/datasets/${id}/charts/`,
  CHART:           (id, cid)  => `${BASE}/datasets/${id}/charts/${cid}`,

  // 관리자
  ADMIN_USERS:     `${BASE}/admin/users/`,
  ADMIN_USER:      (id)       => `${BASE}/admin/users/${id}`,
  ADMIN_DATASETS:  `${BASE}/admin/datasets/`,
};

export default API_URLS;
