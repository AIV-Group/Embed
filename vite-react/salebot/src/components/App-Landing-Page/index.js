/* eslint-disable jsx-a11y/anchor-has-content */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import logo from '../../assets/images/logo.png';
import img from './devices.svg';
import './style.css';

const LandingPage = () => {
    return (
        <div id="template" className="">
            <div
                className="leading-normal tracking-normal text-gray-900"
                style={{ fontFamily: '"Source Sans Pro", sans-serif' }}
            >
                <div className="h-screen pb-14 bg-right bg-cover">
                    {/* bg-img-landing */}
                    <div className="w-full  mx-auto p-6 max-w-7xl lg:px-7 px-10 sm:px-0">
                        <div className="w-full flex items-center justify-between">
                            <a
                                className="flex items-center text-black no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
                                href="#"
                            >
                                <img className="w-[200px]" src={logo} alt="alt" />
                            </a>
                        </div>
                    </div>
                    <div className="w-full pt-24 md:pt-48 lg:max-w-2xl sm:pt-16 px-6 mx-auto flex lg:flex-col md:flex-col sm:flex-col items-center  max-w-6xl">
                        <div className="flex flex-col w-full justify-center lg:items-start overflow-y-hidden">
                            <h1 className="mb-4 text-4xl md:text-4xl sm:text-2xl text-black font-bold leading-tight text-left md:text-left slide-in-bottom-h1">
                                GPT SaleBot - Giải pháp
                            </h1>
                            <p className="leading-normal text-lg  md:text-2xl mb-8 text-left md:text-left slide-in-bottom-subtitle">
                                Giải pháp chăm sóc khách hàng tự động trên ChatGPT
                            </p>
                            <p className="text-blue-400 font-bold pb-8 lg:pb-6 text-left md:text-left fade-in">
                                Dùng thử ngay:
                                <a
                                    className=" text ml-2 text-blue-500"
                                    href="https://gptsalebot.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ textDecoration: 'underline' }}
                                >
                                    Gptsalebot.com
                                </a>
                            </p>
                        </div>
                        <div className="w-full overflow-y-hidden lg:mt-12 ">
                            {/* <img className="w-full mx-auto lg:mr-0 slide-in-bottom" src={img} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
