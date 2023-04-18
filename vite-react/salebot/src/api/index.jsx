import axios from 'axios';

export const fetchAPI = async (path, token = '') => {
    // Merge default and user options
    const mergedOptions = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token !== '' && `Bearer ${token}`,
        },
    };

    // Build request URL
    const requestUrl = `${process.env.REACT_APP_AIV_API_URL}/api/${path}`;

    // Trigger API call
    const response = await fetch(requestUrl, mergedOptions);

    // Handle response
    if (!response.ok) {
        throw new Error(`An error occurred please try again`);
    }

    const data = await response.json();

    return data;
};
export const PostAPI = async (path, data, token = '') => {
    // Merge default and user options
    const mergedOptions = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token !== '' && `Bearer ${token}`,
        },
        method: 'POST',
        body: JSON.stringify({
            ...data,
        }),
    };

    // Build request URL
    const requestUrl = `${process.env.REACT_APP_AIV_API_URL}/api/${path}/`;

    try {
        const response = await fetch(requestUrl, mergedOptions);
        const jsonResponse = await response.json();
        return jsonResponse;
    } catch (error) {
        console.error(error);
    }
};
export const AxiosGetAPI = async (path, token = '') => {
    const url = `${process.env.REACT_APP_AIV_API_URL}/api/${path}`;
    const configHeader = {
        headers: {
            'ngrok-skip-browser-warning': 'any',
            'Content-Type': 'application/json',
            Authorization: token !== '' && `Bearer ${token}`,
        },
    };
    const res = await axios.get(url, configHeader);
    if (!res.data) {
        throw new Error(`An error occurred please try again`);
    }
    return res;
};

export const AxiosPostAPI = async (path, payload, token = '') => {
    const url = `${process.env.REACT_APP_AIV_API_URL}/api/${path}`;
    const configHeader = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token !== '' && `Bearer ${token}`,
        },
    };
    const res = await axios.post(url, payload, configHeader);
    if (!res.data) {
        throw new Error(`An error occurred please try again`);
    }
    return res.data;
};

export const AxiosPatchAPI = async (path, payload, token = '') => {
    const url = `${process.env.REACT_APP_AIV_API_URL}/api/${path}`;
    const configHeader = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token !== '' && `Bearer ${token}`,
        },
    };
    const res = await axios.patch(url, payload, configHeader);
    if (!res.data) {
        throw new Error(`An error occurred please try again`);
    }
    return res.data;
};
