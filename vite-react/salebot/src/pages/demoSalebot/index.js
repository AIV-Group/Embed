/* eslint-disable jsx-a11y/iframe-has-title */
import React, { useEffect, useState } from 'react';
import LandingPage from '../../components/App-Landing-Page';
import Loading from '../../components/loading';
import Chatdemo from './chatdemo';

const DemoSaleBot = () => {
    const [open, setOpen] = useState(true);
    return (
        <div className="w-full h-[100vh]">
            <Chatdemo open={open} setOpen={setOpen} />
            <LandingPage />
        </div>
    );
};

export default DemoSaleBot;
