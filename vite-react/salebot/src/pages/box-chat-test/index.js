import { useEffect, useState } from 'react';
import { TbEdit, TbHistory, TbWorld } from 'react-icons/tb';
import { Link, useParams } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import SettingIcon from '../../assets/images/setting.svg';
import AddToWebsite from '../../components/addToWebsite';
import Loading from '../../components/loading';
import BoxChat from './box-chat';
import './style.css';
const BoxChatTest = () => {
    const { chatid, id } = useParams();
    const [opend, setOpend] = useState(null);
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const handleOpen = (value) => setOpend(value);
    const [checkdatasets, setCheckdatasets] = useState(null);
    const [datasetIds, setDatasetIds] = useState();

    const checkdataset = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.post(`checkdataset`, { dataset_id: id });
            if (res.status === 200 || res.status === 201) {
                setCheckdatasets(res.data.has_data);
                if (!res.data.has_data) return setLoading(false);
                getChatbot();
            }
        } catch (err) {
            console.log('error', err);
            setLoading(false);
        }
    };
    const getChatbot = async () => {
        try {
            const res = await axiosClient.get(`bots/${chatid}/`);
            if (res.status === 200 || res.status === 201) {
                setData(res.data);
                arrDataset_ids(res?.data?.datasets);
                setLoading(false);
            }
        } catch (error) {
            console.log('this error', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        checkdataset();
    }, [id]);

    const arrDataset_ids = (data) => {
        const isAnswer = data?.filter((i) => i?.isAnswer === true).map((i) => i?.id);
        return setDatasetIds(isAnswer);
    };

    return (
        <div className="demo-box-chat">
            <h1 className="pt-16 pb-12 text-4xl sm:text-3xl font-bold text-center">Chatbot</h1>
            {loading ? (
                <div className="h-[500px] sm:h-[200px]">
                    <Loading />
                </div>
            ) : !checkdatasets ? (
                <div className="text-center">
                    <Link to={`/${chatid}/chat/${id}/train_text`}>
                        <button className="px-5 py-4 text-lg text-center rounded bg-slate-300">
                            Hãy bổ sung kiến thức
                        </button>
                    </Link>
                </div>
            ) : (
                <div>
                    <div className="container flex flex-wrap justify-between max-w-5xl p-6 py-4 mx-auto header-box outline outline-1 rounded-xl outline-gray-200 shadow-box ">
                        <div className="sm:mb-2 sm:flex sm:flex-col-reverse">
                            <p className="text-xl sm:text-[15px] font-medium ">Nguồn dữ liệu: Văn bản </p>
                            <p className="name-none sm:mt-0 sm:font-medium sm:text-xl">Tên Chatbot: {data?.name}</p>
                        </div>
                        <div className="flex  icon-box box-block">
                            <Link to={`/setting/${chatid}`}>
                                <img
                                    src={SettingIcon}
                                    alt="setting"
                                    className="mr-2 "
                                    style={{ width: '20px', height: '20px' }}
                                />
                            </Link>
                            <Link to={`/chat/${chatid}/dataset?page=false`}>
                                <TbEdit style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                            </Link>
                            <Link to={`/conversations/${id}`}>
                                <TbHistory style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                            </Link>
                            <div className="relative">
                                <button onClick={() => handleOpen(data?.id)}>
                                    <TbWorld style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                                </button>
                                <AddToWebsite opend={opend} data={data} handleOpen={handleOpen} />
                            </div>
                        </div>
                    </div>
                    <BoxChat data={data} datasetIds={datasetIds} />
                </div>
            )}
        </div>
    );
};

export default BoxChatTest;
