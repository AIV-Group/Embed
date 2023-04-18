import React, { useEffect } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { useLocation, useNavigate } from 'react-router-dom';
import '../assets/css/animate.css';
import Footer from '../components/footer';
import Header from '../components/layout/header';
import useStore from '../hooks/useStore';
import Router from '../router';
function Wrapper() {
    const [state, dispatch] = useStore();
    const path = useLocation();
    const history = useNavigate();

    useEffect(() => {
        if (
            !path?.pathname.includes('/chat-app') &&
            !path?.pathname.includes('/login') &&
            !path?.pathname.includes('/register') &&
            !path?.pathname.includes('/preview')
        ) {
            if (!state?.user.access_token) return history('/');
        }
    }, [state.user, path.pathname]);

    return (
        <div>
            <Header />
            <ReactNotifications />
            <Router />
            <Footer />
        </div>
    );
}

export default Wrapper;
