import axios from 'axios';
import { getCookie, setCookie } from '../components/utils/cookie';
const axiosClient = axios.create({
    baseURL: `${process.env.REACT_APP_AIV_API_URL}/api/`,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = getCookie('access_token');
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token; // for Spring Boot back-end
            // config.headers['x-access-token'] = token; // for Node.js Express back-end
        }
        return config;
    },
    (error) => {
        return error;
    },
);

axiosClient.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (originalConfig.url !== '/api/auth/login' && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const rs = await axiosClient.post('/api/auth/token/refresh', {
                        refreshToken: getCookie('refresh_token'),
                    });

                    const { accessToken } = rs.refresh;
                    setCookie('refresh_token', accessToken);

                    return axiosClient(originalConfig);
                } catch (_error) {
                    return Promise.reject(_error);
                }
            }
        }

        return err.response.data;
    },
);

export default axiosClient;
