import { useContext } from 'react';
import authContext from '../store/authContext';
const useStore = () => {
    const [state, dispatch] = useContext(authContext);

    return [state, dispatch];
};

export default useStore;
