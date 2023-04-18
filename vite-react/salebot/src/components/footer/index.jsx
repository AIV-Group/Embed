import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
const Footer = () => {
    const [isHeader, setIsHeader] = useState(true);
    const { pathname } = useLocation();
    useEffect(() => {
        pathname.includes('chat-app') || pathname.includes('preview') ? setIsHeader(false) : setIsHeader(true);
    }, [pathname]);

    return isHeader ? (
        <div className="w-full bg-[#f1f1f1] ">
            <div className="py-5  text-center mx-auto w-full sm:w-full text-sm font-bold">
                <div>© AIV Group 2023. All rights reserved.</div>
            </div>
        </div>
    ) : null;
};

export default Footer;
