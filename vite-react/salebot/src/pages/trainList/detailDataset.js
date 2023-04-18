import React, { useEffect, useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { BsPencilSquare } from 'react-icons/bs';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/loading';
import { Notification } from '../../components/notification';
import Popup from '../../components/popup';
const DetailDataset = () => {
    const { idDataset, idbot } = useParams();
    const [data, setData] = useState();
    const history = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [idPopup, setIdPopup] = useState(null);
    const [status, setStatus] = useState(false);
    const [botData, setBotData] = useState();

    const getDataset = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.post(`check-dataset-v2`, { dataset_id: idDataset });
            if (res.status === 200 || res.status === 201) {
                setData(res.data);
                setLoading(false);
                setStatus(false);
            } else {
                // Notification('Lỗi', 'Không tìm thấy tập dữ liệu này', 'danger');
                setStatus(true);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
            setStatus(false);
            Notification('Lỗi', 'Không tìm thấy tập dữ liệu này', 'danger');
        }
    };
    const getBot = async () => {
        try {
            const res = await axiosClient.get(`bots/${idbot}/`);
            if (res.status === 200 || res.status === 201) {
                setBotData(res.data);
            }
        } catch (error) {}
    };
    useEffect(() => {
        getBot();
    }, [idbot]);
    const removeDataset = async () => {
        const payload = {
            dataset_id: idDataset,
            data_item_id: idPopup,
        };
        try {
            const res = await axiosClient.delete('data-items', { data: payload });

            if (res.status === 200 || res.status === 201 || res.status === 203) {
                Notification('Thành công', 'Xoá thành công tập dữ liệu', 'success');
                setIsPopupOpen(false);
                getDataset(false);
            } else {
                Notification('Thất bại', 'Không xoá được tập dữ liệu', 'danger');
                setIsPopupOpen(false);
            }
        } catch (error) {
            Notification('Thất bại', 'Không xoá được tập dữ liệu', 'danger');
            setIsPopupOpen(false);
        }
    };
    useEffect(() => {
        getDataset();
    }, [idDataset]);

    const handlePopupOpen = (value) => {
        setIdPopup(value);
        setIsPopupOpen(true);
    };
    return (
        <div className="max-w-6xl mx-auto sm:px-6">
            <div className="hidden w-full max-w-5xl gap-4 mx-auto mt-10 mb-5 sm:block ">
                <IoArrowBack color="black" className="text-[32px] cursor-pointer" onClick={() => history(-1)} />
            </div>
            <h1 className="pt-10 mt-10 text-4xl font-bold text-center sm:pt-0 sm:text-3xl">Chi tiết tập dữ liệu</h1>
            <div className="block w-full max-w-5xl gap-4 mx-auto mt-10 mb-5 sm:hidden ">
                <IoArrowBack color="black" className="text-[32px] cursor-pointer" onClick={() => history(-1)} />
            </div>
            <div className="max-w-4xl mx-auto my-10">
                {loading ? (
                    <div className="h-[400px] sm:h-[200px]">
                        <Loading />
                    </div>
                ) : status ? (
                    <div className="flex flex-col mx-auto h-[400px] sm:h-[200px]">
                        <p className="text-center">Không có tập dữ liệu nào</p>
                    </div>
                ) : (
                    <div className="min-h-[400px] sm:min-h-[200px]">
                        <div className="flex flex-wrap justify-between p-4 pl-0 mb-6 text-xl ">
                            <h1 className="font-bold">Tên tập dữ liệu: {botData?.name && botData?.name}</h1>
                        </div>
                        <div className="flex flex-col gap-4 ">
                            {data?.dataset_details[0]?.data?.map((result, idx) => (
                                <div className="text-black " key={idx}>
                                    <ul className="list-disc">
                                        <li className="flex items-center font-sans text-lg font-semibold">
                                            Nội dung tập dữ liệu: {idx + 1}
                                            <AiOutlineDelete
                                                className="ml-3 text-red-500 cursor-pointer"
                                                onClick={() => handlePopupOpen(result?.id)}
                                                fontSize={20}
                                            />
                                            <Link to={`/${botData?.id}/chat/${idDataset}/update?page=${idx}`}>
                                                <BsPencilSquare
                                                    color="blue"
                                                    className="ml-3 cursor-pointer"
                                                    fontSize={16}
                                                />
                                            </Link>
                                        </li>
                                        <div className="mt-2 text-justify bg-slate-50 border-[#dcdcdc] border p-4 rounded-md hover:shadow-md">
                                            {result?.data_item}
                                        </div>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Popup isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen}>
                <div className="duration-50 fadeIn">
                    <h2 className="text-xl font-bold">Bạn có muốn xoá dữ liệu?</h2>
                    <div className="mt-1">Sau khi xóa, bạn sẽ không thể khôi phục lại.</div>
                    <div className="flex justify-end gap-3 mt-3">
                        <div
                            onClick={() => setIsPopupOpen(false)}
                            className="flex items-center justify-center w-20 h-10 my-3 text-base font-bold text-white bg-gray-700 rounded-md cursor-pointer "
                        >
                            Hủy bỏ
                        </div>
                        <div
                            onClick={removeDataset}
                            className="flex items-center justify-center w-20 h-10 my-3 text-base font-bold text-white bg-blue-500 rounded-md cursor-pointer "
                        >
                            Xóa
                        </div>
                    </div>
                </div>
            </Popup>
        </div>
    );
};

export default DetailDataset;
