import axios from 'axios';

// Interceptors for response handling
const responseSuccessInterceptor = (response) => Promise.resolve(response);

const responseFailureInterceptor = ({ response = {} }) => {
  const errResponse = response?.data || null;
  const status = response?.status;

  if (status === 401) {
    // Handle unauthorized access
    localStorage.removeItem('accessToken');
    console.log('User is not authenticated');
    window.location.href = '/login';
  } else {
    // Handle other errors
    console.error('Error: ', errResponse?.message || errResponse?.detail || errResponse);
  }

  return Promise.reject({
    ...response,
    message: errResponse?.error || errResponse?.detail,
    error: true,
  });
};

// Retrieve access token
export const getAccessToken = async () => {
  return localStorage.getItem('accessToken');
};

// Private API instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
});

instance.interceptors.request.use(
  async (config) => {
    try {
      const token = await getAccessToken();
      if (token) {
        config.headers.Authorization = `Token ${token}`;
      }
      if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        config.headers['Content-Type'] = 'application/json';
      }
      // config.headers["Content-Type"] = "application/json";
      config.headers['Accept'] = '*/*';
    } catch (e) {
      localStorage.removeItem('accessToken');
      window.location.reload();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(responseSuccessInterceptor, responseFailureInterceptor);

// Public API instance
export const publicApi = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_BASE_URL,
});

publicApi.interceptors.request.use(
  (config) => {
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = '*/*';
    return config;
  },
  (error) => Promise.reject(error)
);

publicApi.interceptors.response.use(responseSuccessInterceptor, responseFailureInterceptor);

export default instance;
