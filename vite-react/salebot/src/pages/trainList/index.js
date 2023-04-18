import React, { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import Loading from '../../components/loading';

const TrainList = () => {
    const [dataUpdate, setDataUpdate] = useState();
    const { idbot } = useParams();
    const [loading, setLoading] = useState(false);
    const history = useNavigate();
    const getDataUpdate = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get(`bots/${idbot}/`);
            if (res.status === 200 || res.status === 201) {
                setDataUpdate(res.data);
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }
    };
    useEffect(() => {
        getDataUpdate();
    }, [idbot]);

    return (
        <div className="max-w-6xl py-10 mx-auto min-h-[700px]">
            <div className="hidden w-full max-w-5xl gap-4 mx-auto mt-10 mb-5 sm:block">
                <IoArrowBack className="text-[32px] cursor-pointer" onClick={() => history(-1)} />
            </div>
            <h1 className="text-4xl font-bold text-center sm:pt-0 sm:text-3xl">Chi tiết tập dữ liệu</h1>
            <div>
                {loading ? (
                    <Loading />
                ) : (
                    <div className="flex justify-center mt-12 flex-mobile sm:px-2 ">
                        {dataUpdate?.datasets?.map((item) => (
                            <Link to={`/list/detail/${item?.id}/${idbot}`} key={item?.id}>
                                <button className="flex px-16 sm:px-5 py-5 mr-10 text-lg font-medium rounded-lg bg-slate-100 drop-shadow-lg box-hover">
                                    <span className="ml-2 font-semibold">{item?.name}</span>
                                </button>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainList;
