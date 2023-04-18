/* eslint-disable jsx-a11y/anchor-is-valid */
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import {
    AiOutlineClockCircle,
    AiOutlineDelete,
    AiOutlinePlus,
    AiOutlineSetting,
    AiOutlineShareAlt,
} from 'react-icons/ai';
import { BsChatDots } from 'react-icons/bs';
import { BiCommentDetail } from 'react-icons/bi';
import { IoOpenOutline } from 'react-icons/io5';
import { TbEdit, TbHistory, TbTextRecognition, TbWorld } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import AddToWebsite from '../../components/addToWebsite';
import Loading from '../../components/loading';
import { Notification } from '../../components/notification';
import { converId } from '../../components/utils/convertid';
import useStore from '../../hooks/useStore';

import Popup from '../../components/popup';

const Dashboard = () => {
    const [dataBot, setDataBot] = useState([]);
    const [loader, setLoader] = useState(false);
    const [opend, setOpend] = useState(null);
    const [dateBalance, setDataBalance] = useState();
    const [state, dispatch] = useStore();
    const [share, setShare] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [idPopup, setIdPopup] = useState(null);

    // useOnclickOutside(refShare, () => setShare(null));
    const handleOpen = (value) => setOpend(value);

    const getListBot = async () => {
        setLoader(true);
        try {
            const res = await axiosClient.get('bots/');
            if (res.status === 200 || res.status === 201) {
                setDataBot(res.data);
                setLoader(false);
            }
        } catch (error) {
            console.log('this err', error);
            setLoader(false);
        }
    };
    const checkBalance = async () => {
        try {
            const res = await axiosClient.get('check-balance');
            if (res.status === 200 || res.status === 201) {
                setDataBalance(res.data);
            }
        } catch (error) {
            console.log('err', error);
        }
    };
    useEffect(() => {
        getListBot();
        checkBalance();
    }, []);

    const copyToClipBoard = async (item) => {
        if (item?.datasets?.length !== 0) {
            const url = `${process.env.REACT_APP_DOMIAN}/preview?chat=${encodeURIComponent(converId(item?.id))}`;
            // const url = `http://localhost:3003/preview?chat=${encodeURIComponent(converId(item?.id))}`;
            setShare(null);
            try {
                await navigator.clipboard.writeText(url);
                Notification('Thành công', 'Sao chép link chia sẻ thành công', 'success');
            } catch (err) {
                Notification('Thất bại', 'Không thể sao chép link chia sẻ', 'danger');
            }
        } else {
            Notification('Thất bại', 'Không thể sao chép link chia sẻ', 'danger');
        }
    };

    const handleRemoveBot = async () => {
        try {
            const res = await axiosClient.delete(`bots/${idPopup}/`);
            if (res.status === 200 || res.status === 201 || res.status === 204) {
                getListBot();
                Notification('Thành công', 'Đã xoá chatbot', 'success');
                setIsPopupOpen(false);
            }
        } catch (error) {
            Notification('Thất bại', 'Không xoá được chatbot', 'danger');
        }
    };

    const handlePopupOpen = (id) => {
        setIdPopup(id);
        setIsPopupOpen(true);
    };

    return (
        <div className="w-[1120px] xl:w-[90%] md-w-10 mx-auto py-[160px] pt-20 sm:pt-16 fadeIn">
            <div className="flex justify-center mx-auto mb-16 text-center ">
                <div className="py-4 bg-white shadow px-11 sm:px-2 sm:border">
                    <p className="text-4xl font-bold sm:text-3xl sm:mb-2">Xin chào: {state?.user?.username} </p>
                    <p className="text-xl font-bold">
                        Số trả lời còn lại: {dateBalance?.balance ? dateBalance?.balance : 0}
                    </p>
                </div>
            </div>
            <div className=" py-2 border-b border-[#e2e8f0] ">
                <div className="flex flex-wrap items-center justify-between">
                    <div className="text-4xl font-bold sm:text-3xl">
                        Danh sách chatbot <br className="hidden sm:block" /> của bạn
                    </div>
                    <Link
                        to="/create"
                        className="flex items-center h-8 gap-2 px-2 text-white bg-black rounded-md cursor-pointer sm:mt-6 sm:mb-2 sm:h-14 sm:px-5"
                    >
                        <AiOutlinePlus className="text-[18px] sm:text-[22px] fill-white font-bold" />
                        <span className="text-sm font-bold sm:text-lg">Tạo chatbot mới</span>
                    </Link>
                </div>
                <div className="py-3">Danh sách các chatbot mà bạn đã tạo</div>
            </div>
            <div className="relative flex flex-wrap justify-center mt-20 sm:flex-col gap-14">
                {loader ? (
                    <div className="h-[400px] sm:h-[200px]">
                        <Loading />
                    </div>
                ) : dataBot?.length !== 0 ? (
                    dataBot?.map((item) => (
                        <div
                            className="flex justify-between border sm:flex-col border-[#a0aec0] shadow-md rounded-md"
                            key={item?.id}
                        >
                            <div className="w-72 lg:w-[450px] sm:w-full">
                                <div className="flex flex-col gap-2 p-5">
                                    <div className="pt-2 text-xl font-semibold"> {item?.name}</div>
                                    <div className="flex flex-col gap-1 text-base">
                                        <div className="flex items-center gap-2">
                                            <TbTextRecognition className="text-[20px]" />
                                            <span className="text-base max-w-[800px]">
                                                {item?.type_dataset === 0
                                                    ? 'Dữ liệu văn bản'
                                                    : item?.type_dataset === 1
                                                    ? 'Dữ liệu file'
                                                    : 'Dữ liệu website'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-5 p-5 sm:pt-0">
                                    {/* <div className="flex w-fit items-center gap-2 bg-[#edf2f7] px-2 rounded-sm">
                                        <TbMessageCircle2 />
                                        <span className="text-sm">0</span>
                                    </div> */}
                                    <div className="flex w-fit items-center gap-2 bg-[#edf2f7] px-2 rounded-sm">
                                        <AiOutlineClockCircle />
                                        <span className="text-sm font-thin">
                                            {dayjs(item?.created_at).format('YYYY-MM-DD HH:mm')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="border-l  sm:w-full sm:border-t w-[220px] sm:border-l-0 border-[#cbd5e0] text-[#2d3748]">
                                <div className="flex flex-col gap-2 px-2 py-5">
                                    <Link
                                        to={`/setting/${item?.id}`}
                                        className="flex px-2 py-1 items-center gap-1 cursor-pointer hover:bg-[#edf2f7]  hover:shadow-xl transition	 rounded-md"
                                    >
                                        <AiOutlineSetting className="text-[20px]" />
                                        <span className="text-base">Cài đặt</span>
                                    </Link>
                                    <Link to={{ pathname: `/chat/${item?.id}/dataset` }}>
                                        <div className="flex px-2 py-1 items-center gap-1 cursor-pointer hover:bg-[#edf2f7] hover:shadow-xl transition	 rounded-md">
                                            <TbEdit className="text-[20px]" />
                                            <span className="text-base">Huấn luyện chatbot</span>
                                        </div>
                                    </Link>
                                    <Link to={`/conversations/${item?.id}`}>
                                        <div className="flex px-2 py-1 items-center gap-1 cursor-pointer hover:bg-[#edf2f7] hover:shadow-xl transition	 rounded-md">
                                            <TbHistory className="text-[20px]" />
                                            <span className="text-base">Lịch sử hội thoại</span>
                                        </div>
                                    </Link>
                                    <Link to={`/${item?.id}/chat/${item?.datasets[0]?.id}`}>
                                        <div className="flex px-2 py-1 items-center gap-1 cursor-pointer hover:bg-[#edf2f7] hover:shadow-xl transition	 rounded-md">
                                            <BsChatDots className="text-[20px]" />
                                            <span className="text-base">Dùng thử chatbot</span>
                                        </div>
                                    </Link>
                                    <Link>
                                        <div
                                            onClick={() => copyToClipBoard(item)}
                                            className="flex px-2 py-1 items-center relative gap-1 cursor-pointer hover:bg-[#edf2f7] hover:shadow-xl transition	 rounded-md"
                                        >
                                            <AiOutlineShareAlt className="text-[20px]" />
                                            <span className="text-base">Lấy link public</span>
                                        </div>
                                    </Link>
                                    <a
                                        target="_blank"
                                        href={`/preview?chat=${encodeURIComponent(converId(item?.id))}`}
                                        rel="noreferrer"
                                    >
                                        <div className="flex px-2 py-1 items-center relative gap-1 cursor-pointer hover:bg-[#edf2f7] hover:shadow-xl transition	 rounded-md">
                                            <IoOpenOutline className="text-[20px]" />
                                            <span className="text-base">Mở link public</span>
                                        </div>
                                    </a>
                                    <Link to={`/list/${item?.id}`}>
                                        <div className="flex px-2 py-1 items-center relative gap-1 cursor-pointer hover:bg-[#edf2f7] hover:shadow-xl transition	 rounded-md">
                                            <BiCommentDetail className="text-[20px]" />
                                            <span className="text-base">Chi tiết tập tài liệu</span>
                                        </div>
                                    </Link>
                                    <div className="relative">
                                        <div
                                            onClick={() => handleOpen(item?.id)}
                                            className="flex px-2 py-1 items-center gap-1 cursor-pointer hover:bg-[#edf2f7] hover:shadow-xl transition	 rounded-md "
                                        >
                                            <TbWorld className="text-[20px]" />
                                            <span className="text-base">Nhúng vào website</span>
                                        </div>

                                        <AddToWebsite opend={opend} data={item} handleOpen={handleOpen} />
                                    </div>
                                    {/* <div onClick={() => handleRemoveBot(item?.id)}> */}
                                    <div onClick={() => handlePopupOpen(item?.id)}>
                                        <div className="flex px-2 py-1 items-center gap-1 cursor-pointer hover:bg-[#edf2f7] hover:shadow-xl transition	 rounded-md">
                                            <AiOutlineDelete className="text-[20px]" />
                                            <span className="text-base">Xoá chatbot</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="mt-40 text-2xl text-center">Bạn chưa có Chatbot nào</div>
                )}

                <Popup isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen}>
                    <div className="duration-50 fadeIn">
                        <h2 className="text-xl font-bold">Bạn có thực sự muốn xóa chatbot?</h2>
                        <div className="mt-1">Sau khi xóa, bạn sẽ không thể khôi phục lại.</div>
                        <div className="flex justify-end gap-3 mt-3">
                            <div
                                onClick={() => setIsPopupOpen(false)}
                                className="flex items-center justify-center w-20 h-10 my-3 text-base font-bold text-white bg-gray-700 rounded-md cursor-pointer "
                            >
                                Hủy bỏ
                            </div>
                            <div
                                onClick={handleRemoveBot}
                                className="flex items-center justify-center w-20 h-10 my-3 text-base font-bold text-white bg-blue-500 rounded-md cursor-pointer "
                            >
                                Xóa
                            </div>
                        </div>
                    </div>
                </Popup>
            </div>
        </div>
    );
};

export default Dashboard;
