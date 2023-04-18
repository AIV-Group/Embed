import { useEffect, useRef, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import ReactLoading from 'react-loading';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import { Notification } from '../../components/notification';
import useStore from '../../hooks/useStore';
import '../create-new/style.css';
import { get_encoding, encoding_for_model } from '@dqbd/tiktoken';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Debounced from '../../components/utils/useDebouced';
import Loading from '../../components/loading';
// Extend existing encoding with custom special tokens
// encoding.free();

const UpdateWithText = () => {
    let { chatid, id } = useParams();
    const [newDataTrain, setNewDataTrain] = useState('');
    const [count, setCount] = useState(0);
    const [loader, setLoder] = useState(false);
    const ref = useRef();
    const [dataPart, setDatapart] = useState();
    const [lengths, setLenghts] = useState(0);
    const [searchParam, setSearchParam] = useSearchParams();

    const page = searchParam.get('page');
    const [itemID, setItemID] = useState(null);
    const [pageData, setPageData] = useState(0);

    const useDebounced = Debounced(newDataTrain, 500);
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const history = useNavigate();

    const getTiktoken = (value) => {
        const encoding = get_encoding('cl100k_base');
        const tokens = encoding.encode(value);
        setLenghts(tokens.length);
        encoding.free();
    };

    const handleInputChange = async (value) => {
        setNewDataTrain(value);
    };

    useEffect(() => {
        getTiktoken(useDebounced);
    }, [useDebounced]);

    const getDataset = async () => {
        setLoadingUpdate(true);
        try {
            const res = await axiosClient.post(`check-dataset-v2`, { dataset_id: id });
            if (res.status === 200 || res.status === 201) {
                setCount(res?.data?.dataset_details[0]?.documents_count);
                if (Number(page) >= 0) {
                    setNewDataTrain(res.data.dataset_details[0]?.data[Number(page)].data_item);
                    setItemID(res.data.dataset_details[0]?.data[Number(page)].id);
                    const total = Number(res.data.dataset_details[0]?.data?.length) - 1;
                    setPageData(total);
                    setLoadingUpdate(false);
                }
            } else {
                Notification('Thất bại', 'Bạn chưa có dữ liệu nào', 'danger');
                setSearchParam(false);
            }
        } catch (error) {
            Notification('Thất bại', 'Bạn chưa có dữ liệu nào', 'danger');
            setLoadingUpdate(false);
        }
    };

    useEffect(() => {
        getDataset();
    }, [id, page]);

    const updateTrain = async () => {
        if (!newDataTrain) return ref.current.focus();
        if (count > 40) return;
        setLoder(true);
        try {
            const res = await axiosClient.put(`data-items`, {
                dataset_id: id,
                data_train: newDataTrain,
                data_item_id: itemID,
            });
            if (res.status === 200 || res.status === 201) {
                setLoder(false);
                setLenghts(0);
                getDataset();
                Notification('Thành công', 'Cập nhật dữ liệu thành công', 'success');
            } else {
                Notification('Thất bại', 'Cập nhật dữ liệu thất bại', 'danger');
            }
        } catch (error) {
            setLoder(false);
            Notification('Thất bại', 'Cập nhật dữ liệu thất bại', 'danger');
        }
    };
    const handleGetData = (value) => {
        if (value <= 0) return history(`?page=0`);
        if (value > 40) return history(`?page=40`);
        if (value <= pageData) return history(`?page=${value}`);
        if (value >= 0 && value <= pageData && value <= 40) return history(`?page=${value}`);
    };

    return (
        <div>
            <div className="sm:block hidden w-full mt-6 max-w-5xl sm:px-5 gap-4 mx-auto mb-5">
                <IoArrowBack className="text-[32px] cursor-pointer" onClick={() => history(-1)} />
            </div>
            <h1 className="pt-12 pb-8 sm:pt-5 text-4xl sm:text-3xl font-bold text-center">
                Cập nhật kiến thức <br className="hidden sm:block" /> cho SaleBot
            </h1>
            <div className="block sm:hidden w-full max-w-5xl gap-4 mx-auto mb-5">
                <IoArrowBack className="text-[32px] cursor-pointer" onClick={() => history(-1)} />
            </div>
            {loadingUpdate ? (
                <div className="h-[500px] sm:h-[200px]">
                    <Loading />
                </div>
            ) : (
                <div className="container max-w-2xl mx-auto mobile-box">
                    <div className="pb-3">
                        <div className="flex flex-wrap items-center ">
                            <div className="mr-4 text-lg font-bold">ID:</div>
                            <p>{id}</p>
                        </div>
                    </div>
                    <h1 className="py-4 pb-0 text-lg font-bold">Dữ liệu đào tạo:{Number(page) + 1}/40</h1>
                    <h1 className="pb-2 text-sm font-medium text-gray-400 flex items-center">
                        <span className={`${lengths > 600 ? 'text-red-500' : null}`}>({lengths}/600) Token</span>
                        <AiOutlineQuestionCircle id="token-tilte" className="ml-2" fontSize={20} />
                        <ReactTooltip
                            anchorId="token-tilte"
                            place="top"
                            variant="info"
                            content="Tương đương 1 trang A4 tiếng Việt hoặc 2 trang A4 tiếng Anh, font chữ 20"
                        />
                        {lengths > 600 && <span className="text-red-500 ml-9">- Vượt quá dữ liệu train cho phép</span>}
                    </h1>
                    <div className="flex flex-wrap gap-4 mb-2 justify-end">
                        <button className="border-r pr-4" onClick={() => handleGetData(Number(page) - 1)}>
                            Trước
                        </button>
                        <button onClick={() => handleGetData(Number(page) + 1)}>Sau</button>
                    </div>
                    {count < 40 ? (
                        <textarea
                            ref={ref}
                            name="data-source"
                            placeholder="Một cái gì đó chatbot của bạn"
                            id="data-source"
                            required
                            defaultValue={newDataTrain}
                            aria-required="true"
                            className={`p-3 text-gray-900 w-full h-[500px] sm:h-[250px]  rounded-lg ${
                                lengths > 600
                                    ? 'outline-red-500 outline '
                                    : 'border-slate-400 border-0  outline-slate-200 outline outline-2'
                            } `}
                            onChange={(e) => handleInputChange(e.target.value)}
                        ></textarea>
                    ) : (
                        <textarea
                            disabled
                            name="data-source"
                            placeholder="Một cái gì đó chatbot của bạn"
                            id="data-source"
                            aria-required="true"
                            className="p-3 text-gray-900 w-full h-[500px] sm:h-[250px]  rounded-lg border-slate-400 border-0  outline-slate-200 outline outline-2"
                        ></textarea>
                    )}

                    <div className="flex sm:flex-wrap sm:justify-center justify-end pt-8 function-btn">
                        {count < 40 ? (
                            <div className="text-right sm:w-full  sm:text-center">
                                {loader ? (
                                    <button className="py-3 mb-12 text-base font-medium text-white bg-black text-center rounded-lg px-14 w-[150px]">
                                        <ReactLoading type="spin" width={24} height={24} color="white" />
                                    </button>
                                ) : lengths < 600 ? (
                                    <button
                                        className="py-3 mb-12 text-base font-medium text-white bg-black rounded-lg px-14 sm:w-full"
                                        onClick={updateTrain}
                                    >
                                        Cập nhật
                                    </button>
                                ) : (
                                    <button className="py-3 mb-12 text-base font-medium text-white bg-gray-300 rounded-lg px-14 sm:w-full">
                                        Cập nhật
                                    </button>
                                )}
                            </div>
                        ) : null}
                        {count >= 1 ? (
                            <div className="ml-5 sm:ml-0 sm:w-full sm:text-center text-right">
                                <Link to={`/${chatid}/chat/${id}`}>
                                    <button className="py-3 mb-12 text-base font-medium text-white bg-black rounded-lg px-14 sm:w-full">
                                        Thử nghiệm chatbot
                                    </button>
                                </Link>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateWithText;
