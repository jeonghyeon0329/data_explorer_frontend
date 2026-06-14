function getToken() {
  return localStorage.getItem('access_token');
}

const request = async (url, method = 'GET', body = null, headers = {}) => {
  const token = getToken();
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };
  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data?.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

export const requestMultipart = async (url, method = 'POST', formData) => {
  const token = getToken();
  const config = {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Content-Type 생략 — 브라우저가 boundary 포함하여 자동 설정
    },
    body: formData,
  };
  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data?.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
};

export default request;
