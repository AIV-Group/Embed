import React, { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/loading';

const History = () => {
    const { id } = useParams();
    const history = useNavigate();
    const [messageList, setMessageList] = useState([]);
    const [loading, setLoading] = useState(false);

    const getHistory = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`conversations/${id}/`);
            if (res.status === 200 || res.status === 201) {
                setMessageList(res?.data?.messages);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }
    };
    useEffect(() => {
        getHistory();
    }, [id]);
    return (
        <div className="container max-w-6xl mx-auto conversation">
            <div>
                <div className=" hidden sm:block sm:ml-4 mt-6 w-full max-w-5xl gap-4 mx-auto mb-2">
                    <IoArrowBack className="text-[32px] cursor-pointer" onClick={() => history(-1)} />
                </div>
                <h1 className="pt-10 sm:pt-5 text-4xl sm:text-3xl font-bold text-center">Lịch sử cuộc hội thoại</h1>
                <div className=" block sm:hidden w-full max-w-5xl gap-4 mx-auto mb-5">
                    <IoArrowBack className="text-[32px] cursor-pointer" onClick={() => history(-1)} />
                </div>
            </div>
            {loading ? (
                <div className="h-[500px] sm:h-[200px]">
                    <Loading />
                </div>
            ) : (
                <div className="chat-history h-[500px]  mt-11 border ">
                    <ul className="m-b-0" style={{ overflowY: 'scroll' }}>
                        {messageList.map((item, index) => (
                            <div className="flex flex-col gap-5 px-4 pt-4 " key={index}>
                                {item?.role === 'assistant' ? (
                                    <div className="flex justify-start">
                                        <div
                                            className="p-5 text-white w-fit rounded-xl"
                                            style={{ backgroundColor: '#edf2f7', color: 'black' }}
                                        >
                                            {item.content}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-end">
                                        <div
                                            className="p-5 text-white w-fit rounded-xl"
                                            style={{ backgroundColor: '#1a94da', color: '#fff' }}
                                        >
                                            {item.content}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default History;
