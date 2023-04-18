export const converId = (id) => {
    const conver = id.replaceAll('-', '&#w#');
    return conver;
};
