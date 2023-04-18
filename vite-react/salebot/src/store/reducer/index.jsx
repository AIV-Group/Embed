import { getCookie } from '../../components/utils/cookie';
const initState = {
    user: {
        access_token: getCookie('access_token'),
        refresh_token: getCookie('refresh_token'),
        username: getCookie('username'),
        email: '',
        firstName: '',
        lastName: '',
        user_id: getCookie('user_id'),
    },
};

function reducer(state, action) {
    switch (action.type) {
        case 'setUser':
            return {
                ...state,
                user: action.payload,
            };

        default:
            throw new Error('invalid action');
    }
}
export { initState };
export default reducer;
