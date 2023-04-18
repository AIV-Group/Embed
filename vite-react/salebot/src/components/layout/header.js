import { googleLogout } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import useStore from '../../hooks/useStore';
import { setUser } from '../../store/actions';
import ButtonRouter from '../button';
import { ClearCookies } from '../utils/cookie';
const Header = () => {
    const [isHeader, setIsHeader] = useState(true);
    const { pathname } = useLocation();
    const router = useNavigate();

    const [state, dispatch] = useStore();
    const [isLogin, setIsLogin] = useState(false);

    useEffect(() => {
        pathname.includes('chat-app') || pathname.includes('preview') ? setIsHeader(false) : setIsHeader(true);
    }, [pathname]);

    useEffect(() => {
        state.user?.access_token ? setIsLogin(true) : setIsLogin(false);
    }, [state.user]);

    const handleLogout = () => {
        dispatch(
            setUser({
                access_token: null,
                refresh_token: null,
                username: null,
                user_id: null,
            }),
        );
        googleLogout();
        ClearCookies();
        router('/login');
    };

    return isHeader ? (
        <header
            className="py-4"
            style={{ boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px' }}
        >
            <div className="xl:w-[90%] sm:w-[100%] w-[1120px] mx-auto sm:px-5 my-0 flex justify-between items-center">
                <div className="">
                    <Link className="text-xl font-bold pointer" to="/">
                        <img
                            src={logo}
                            className="w-[150px] sm:w-[120px]"
                            style={{ transform: 'scale(1.3)' }}
                            alt="logo aiv"
                        />
                    </Link>
                </div>
                <nav className="">
                    <ul className="flex items-center font-semibold">
                        {/* <li>
                            <Link className="px-4 py-2 rounded-md active:bg-gray-300 hover:bg-gray-200" to="/price">
                                Bảng giá
                            </Link>
                        </li> */}
                        {/* <li>
                            <Link className="px-4 py-2 ml-8 rounded-md active:bg-gray-300 hover:bg-gray-200" to="/faqs">
                                FAQs
                            </Link>
                        </li>
                        <li>
                            <Link className="px-4 py-2 ml-8 rounded-md active:bg-gray-300 hover:bg-gray-200" to="/api">
                                API Reference
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="px-4 py-2 ml-8 rounded-md active:bg-gray-300 hover:bg-gray-200"
                                to="/pricing"
                            >
                                Pricing
                            </Link>
                        </li> */}
                    </ul>
                </nav>
                <ButtonRouter isLogin={isLogin} handleLogout={handleLogout} />
            </div>
        </header>
    ) : null;
};

export default Header;
