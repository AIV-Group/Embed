export const setCookie = (name, value) => {
    document.cookie = name + '=' + value + ';path=/';
};

export const getCookie = (name) => {
    var cname = name + '=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length, c.length);
        }
    }
    return '';
};

export const isTokenExpired = (tokenExpirationTime) => {
    const currentTime = Date.now() / 1000;
    return tokenExpirationTime < currentTime;
};

export const ClearCookies = () => {
    const Cookies = document.cookie.split(';');
    // set past expiry to all cookies
    for (let i = 0; i < Cookies.length; i++) {
        document.cookie = Cookies[i] + '=; expires=' + new Date(0).toUTCString();
    }
};
