import { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/loading';

const Dataset = () => {
    let { chatid } = useParams();
    const [dataUpdate, setDataUpdate] = useState();
    const [page, setPage] = useState(true);
    const [idDataset, setIdDataset] = useState();
    const [loading, setLoading] = useState(false);
    const history = useNavigate();
    const [param, setParam] = useSearchParams();

    useEffect(() => {
        param.get('page') !== false ? getDataUpdate() : setPage(false);
    }, [chatid]);

    const getDataUpdate = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`bots/${chatid}/`);
            if (res.status === 200 || res.status === 201) {
                setDataUpdate(res.data);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }
    };
    const handleChange = (value) => {
        setIdDataset(value);
        setPage(false);
    };

    return (
        <div className="py-10 create_new sm:px-5 ">
            <div className="hidden w-full max-w-5xl gap-4 mx-auto mb-5 sm:block">
                <IoArrowBack
                    className="text-[32px] cursor-pointer"
                    onClick={() => (page ? history(-1) : setPage(true))}
                />
            </div>
            <h1 className="pt-10 text-4xl font-bold text-center sm:pt-0 sm:text-3xl ">
                Lựa chọn tập dữ liệu cần huấn luyện
            </h1>
            <div className="block w-full max-w-5xl gap-4 mx-auto mb-5 md:px-8 lg:px-8 sm:hidden">
                <IoArrowBack
                    className="text-[32px] cursor-pointer"
                    onClick={() => (page ? history(-1) : setPage(true))}
                />
            </div>
            {loading ? (
                <div className="h-[500px] sm:h-[200px]">
                    <Loading />
                </div>
            ) : page ? (
                <div className="flex justify-center mt-12 flex-mobile sm:min-h-[72vh] min-h-[60vh]">
                    {dataUpdate?.datasets?.map((item) => (
                        <Link onClick={() => handleChange(item?.id)} key={item?.id}>
                            <button className="flex px-16 py-5 mr-10 text-lg font-medium rounded-lg bg-slate-100 drop-shadow-lg box-hover">
                                <span className="ml-2 font-semibold">{item?.name}</span>
                            </button>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="flex justify-center mt-12 flex-mobile h-[500px] sm:h-[200px]">
                    <Link to={`/${chatid}/chat/${idDataset}/update?page=0`}>
                        <button className="flex px-16 py-5 mr-10 text-lg font-medium rounded-lg bg-slate-100 drop-shadow-lg box-hover">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="tabler-icon tabler-icon-text-recognition"
                                aria-hidden="true"
                                focusable="false"
                            >
                                <path d="M4 8v-2a2 2 0 0 1 2 -2h2"></path>
                                <path d="M4 16v2a2 2 0 0 0 2 2h2"></path>
                                <path d="M16 4h2a2 2 0 0 1 2 2v2"></path>
                                <path d="M16 20h2a2 2 0 0 0 2 -2v-2"></path>
                                <path d="M12 16v-7"></path>
                                <path d="M9 9h6"></path>
                            </svg>
                            <span className="ml-2 font-semibold">Văn bản</span>
                        </button>
                    </Link>
                    {/* <Link>
                        <button className="flex px-16 py-5 mr-10 text-lg font-medium rounded-lg bg-slate-50 ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                            </svg>

                            <span className="ml-2 font-semibold">File</span>
                        </button>
                    </Link>
                    <Link>
                        <button className="flex py-5 mr-10 text-lg font-medium rounded-lg px-14 bg-slate-50 ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                                />
                            </svg>

                            <span className="ml-2 font-semibold">Website</span>
                        </button>
                    </Link> */}
                </div>
            )}
        </div>
    );
};

export default Dataset;
