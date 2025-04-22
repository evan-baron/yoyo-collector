import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: '',
	withCredentials: true,
});

// Add an interceptor to handle the `Content-Type` header dynamically
axiosInstance.interceptors.request.use((config) => {
	if (config.data instanceof FormData) {
		// Don't set `Content-Type` for FormData requests, let Axios handle it
		delete config.headers['Content-Type'];
	} else {
		// Set `Content-Type` to `application/json` for non-FormData requests
		config.headers['Content-Type'] = 'application/json';
	}
	return config;
});

export default axiosInstance;
