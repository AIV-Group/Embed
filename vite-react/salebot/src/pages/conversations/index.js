import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/loading';
const Conversations = () => {
    let { id } = useParams();
    const [data, setData] = useState(null);
    const [loader, setLoader] = useState(false);
    const [err, setError] = useState(false);

    const getData = async () => {
        setLoader(true);
        try {
            const res = await axiosClient.get(`list-conversation-bot/${id}`);
            if (res?.message === 'Not found') {
                setError(true);
                setLoader(false);
            }

            if (res.status === 200 || res.status === 201) {
                setData(res.data);
                setLoader(false);
                setError(false);
            }
        } catch (error) {
            setLoader(false);
            setError(false);
        }
    };
    useEffect(() => {
        getData();
    }, [id]);

    return (
        <div className="container max-w-6xl pb-10 mx-auto conversations sm:px-5">
            <h1 className="pt-12 pb-3 text-4xl font-bold sm:text-3xl">Danh sách hội thoại</h1>
            <p className="pb-5 text-lg border-b-2 border-zinc-200">Tất cả các cuộc trò chuyện với chatbot: {id}</p>
            {loader ? (
                <div className="h-[400px] sm:h-[200px]">
                    <Loading />
                </div>
            ) : data?.length !== 0 ? (
                data?.map((item) => (
                    <>
                        <Link to={`/history/${item?.id}`} key={item?.id}>
                            <div className="pt-12 pb-2 ">
                                <div className="flex items-center justify-between p-6 sm:flex-col sm:items-start sm:py-2 outline outline-2 rounded-xl outline-slate-200 history-box">
                                    <div className="flex">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="#4A5568"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="tabler-icon tabler-icon-message-circle"
                                        >
                                            <path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1"></path>
                                        </svg>
                                        <p className="ml-3">{item?.messages[1]?.content}</p>
                                    </div>
                                    <div>
                                        <p className="sm:text-gray-400 sm:mt-2">
                                            {dayjs(item?.created_at).format('YYYY-MM-DD HH:mm')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </>
                ))
            ) : (
                <div className="mt-32 text-xl text-center min-h-[70vh] sm:min-h-[72vh]">
                    Không có cuộc trò chuyện gần đây
                </div>
            )}
            {err && (
                <div className="mt-32 text-xl text-center min-h-[70vh] sm:min-h-[72vh]">
                    Không có cuộc trò chuyện gần đây
                </div>
            )}
        </div>
    );
};

export default Conversations;
