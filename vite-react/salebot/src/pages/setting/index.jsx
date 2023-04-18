import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineCheck, AiOutlineSetting } from 'react-icons/ai';
import { IoAdd, IoAddCircleOutline, IoArrowBack, IoCloseOutline } from 'react-icons/io5';

import { get_encoding } from '@dqbd/tiktoken';
import { AiOutlineEdit } from 'react-icons/ai';
import ReactLoading from 'react-loading';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import axiosClient from '../../api/axiosClient';
import { AxiosPatchAPI } from '../../api/index';
import Loading from '../../components/loading';
import { Notification } from '../../components/notification';
import Debounced from '../../components/utils/useDebouced';
import useOnclickOutside from '../../hooks/useOnclickOutside';
import useStore from '../../hooks/useStore';
import Styling from './components/styling';

const options = [
    { value: 0, label: 'Tiếng Việt' },
    { value: 1, label: 'Tiếng Anh' },
];
const Setting = () => {
    const [state, dispatch] = useStore();
    const token = state.user.access_token;
    const created_by = state.user.user_id;
    const [chatSetting, setChatSetting] = useState();
    const [messages, setMessages] = useState('');
    const [loader, setLoader] = useState(false);
    const [style, setStyle] = useState();

    const [name, setName] = useState('');
    const [prompt, setPrompt] = useState('');
    const [langue, setLangue] = useState();
    const [isPublish, setIsPublish] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [indexFocus, setIndexFocus] = useState(null);
    const [opend, setOpend] = useState(false);
    const [nameDataset, setNameDataset] = useState('');
    const [loaderAddDateset, setLoaderAddDataset] = useState(false);
    const [changeName, setChangeName] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();

    const editRef = useRef();
    const [lengths, setLenghts] = useState('');
    const [err, setErr] = useState(false);

    useOnclickOutside(editRef, () => setIsEditMode(false));

    const getChatSetting = async () => {
        setLoader(true);
        try {
            const res = await axiosClient.get(`bots/${id}/`);
            if (res.status === 200 || res.status === 201) {
                setLoader(false);
                setChatSetting(res.data);
                setName(res?.data.name);
                setIsPublish(res?.data.isPublic);
                if (res?.data.languageCode === 0) {
                    setLangue(options[0]);
                } else {
                    setLangue(options[1]);
                }
                // setLangue({
                //     value: res?.data.languageCode,
                //     label: res?.data.languageCode === 0 ? 'Tiếng Việt' : 'Tiếng Anh',
                // });
                setPrompt(res.data.system_prompt);
            }
        } catch (err) {
            setLoader(false);
            setMessages('Lỗi cập nhật setting?');
        }
    };

    useEffect(() => {
        getChatSetting();
    }, [id]);

    const updateSetting = async () => {
        if (lengths > 200) return;
        setLoader(true);
        const newSetting = await configdata();
        try {
            const res = await AxiosPatchAPI(`bots/${id}/`, newSetting, token);
            if (res) {
                getChatSetting();
                Notification('Thành công', 'Cập nhật cài đặt thành công', 'success');
                setLoader(false);
            } else {
                setLoader(false);
                Notification('Thất bại', 'Cập nhật cài đặt thất bại', 'danger');
            }
        } catch (error) {
            Notification('Thất bại', 'Cập nhật cài đặt thất bại', 'danger');
            setLoader(false);
        }
    };

    const configdata = () => {
        const payload = {
            name: name,
            created_by: created_by,
            system_prompt: prompt ? prompt : '',
            type_dataset: 0,
            languageCode: langue?.value,
            isPublic: isPublish,
            ...style,
        };
        return payload;
    };

    const addDataset = async () => {
        if (!nameDataset) return;
        setLoaderAddDataset(true);
        const playload = {
            name: nameDataset,
            isAnswer: false,
            bot: id,
        };
        try {
            const res = await axiosClient.post('datasets/', playload);
            if (res.status === 200 || res.status === 201) {
                setLoaderAddDataset(false);
                Notification('Thành công', 'Thêm tên dữ liệu thành công', 'success');
                navigate(`/${id}/chat/${res?.data?.id}/train_text`);
            }
        } catch (error) {
            Notification('Thất bại', 'Thêm tên dữ liệu thất bại', 'dangger');
            setLoaderAddDataset(false);
        }
    };
    const updateIsAnswer = async (data, checked) => {
        const playload = {
            isAnswer: checked,
        };
        try {
            const res = await axiosClient.put(`datasets/${data?.id}/`, playload);
            if (res.status === 200 || res.status === 201) {
                res.data.isAnswer
                    ? Notification('Thành công', 'Đã thêm dữ liệu chat', 'success')
                    : Notification('Thành công', 'Đã gỡ dữ liệu chat', 'success');
            }
        } catch (error) {
            Notification('Thất bại', 'Không thêm được dữ liệu chat', 'dangger');
        }
    };

    const UpdateViewName = async () => {
        try {
            const res = await axiosClient.put(`datasets/${indexFocus}/`, { name: changeName });
            if (res.status === 200 || res.status === 201) {
                Notification('Thành công', 'Đổi tên thành công', 'success');
                setIsEditMode(false);
                getChatSetting();
            }
        } catch (error) {
            Notification('Thất bại', 'Đổi tên thất bại', 'dangger');
        }
    };

    const handleChangeName = (e) => {
        setChangeName(e.target.value);
        if (e.key === 'Enter' && changeName !== e.target.defaultValue && changeName !== '') {
            UpdateViewName();
        }
        if (e.key === 'Escape') {
            setIsEditMode(false);
        }
    };

    const handleEditMode = (id) => {
        setIndexFocus(id);
        setIsEditMode(true);
    };
    const useDebounced = Debounced(prompt, 300);

    const getTiktoken = (value) => {
        const encoding = get_encoding('cl100k_base');
        const tokens = encoding.encode(value);
        setLenghts(tokens.length);
        if (tokens.length > 200) {
            setErr(true);
        } else if (tokens.length === 0) {
            setErr(true);
        } else {
            setErr(false);
        }
        encoding.free();
    };

    useEffect(() => {
        getTiktoken(useDebounced);
    }, [useDebounced]);

    return (
        <div className="w-[1120px] xl:w-[90%] md-w-10 mx-auto pt-[160px] pb-10 lg:pt-[100px] ">
            {loader ? (
                <div className="h-[500px] sm:h-[200px]">
                    <Loading />
                </div>
            ) : (
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col w-full gap-4">
                        <IoArrowBack className="text-[32px] cursor-pointer" onClick={() => navigate(-1)} />
                        <div className="w-full text-4xl font-bold text-center">Cài đặt</div>
                    </div>
                    <div className=" border border-[#A0AEC0] rounded-md p-5 shadow-xl">
                        <div className="text-xl font-semibold">Thông tin Chatbot</div>

                        <div className="flex flex-col gap-4 pt-5">
                            <div className="flex flex-wrap gap-3">
                                <div className="font-semibold text-md">Chatbot Id: </div>
                                <div>{id}</div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="font-semibold text-md">Tên chatbot</div>
                                <input
                                    defaultValue={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-10 pl-5 transition-all ease-in-out border rounded-md outline-none duration-400 focus:ring-1 "
                                    type="text"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="font-semibold text-md ">Chọn tập dữ liệu tham gia trả lời</div>
                                <div className="flex flex-wrap items-center gap-3">
                                    {chatSetting?.datasets?.map((item) => (
                                        <div
                                            className="flex items-center gap-2 min-w-[200px] sm:w-full h-10 px-4 border rounded "
                                            key={item?.id}
                                        >
                                            <input
                                                id={item?.id}
                                                type="checkbox"
                                                defaultChecked={item?.isAnswer}
                                                onClick={(e) => updateIsAnswer(item, e.target.checked)}
                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded sm:w-6 focus:ring-transparent dark:focus:ring-blue-600 "
                                            />
                                            {isEditMode && indexFocus === item?.id ? (
                                                <div
                                                    className="flex items-center justify-between flex-grow h-full "
                                                    ref={editRef}
                                                >
                                                    <input
                                                        type="text"
                                                        defaultValue={item?.name}
                                                        onKeyUp={(e) => handleChangeName(e)}
                                                        className="h-full pl-0 text-lg "
                                                        autoFocus
                                                    />
                                                    <AiOutlineCheck
                                                        className="text-[20px] cursor-pointer text-green-600"
                                                        onClick={
                                                            item?.name !== changeName ? () => UpdateViewName() : null
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <label
                                                    htmlFor={item?.id}
                                                    className="flex-grow pr-2 text-lg text-gray-900 w-fit text-md dark:text-gray-300"
                                                >
                                                    {item?.name}
                                                </label>
                                            )}
                                            <div className="flex gap-2 border-l">
                                                <Link to={`/${id}/chat/${item?.id}/update?page=0`}>
                                                    <AiOutlineSetting style={{ marginLeft: '10px' }} fontSize={20} />
                                                </Link>
                                                <AiOutlineEdit
                                                    onClick={() => handleEditMode(item?.id)}
                                                    className="text-[22px] cursor-pointer"
                                                />
                                            </div>
                                        </div>
                                    ))}

                                    {chatSetting?.datasets?.length < 3 &&
                                        (!opend ? (
                                            <button className="ml-5 text-blue" onClick={() => setOpend(true)}>
                                                <IoAddCircleOutline fontSize={30} />
                                            </button>
                                        ) : (
                                            <div className="relative flex items-center sm:w-full">
                                                <input
                                                    placeholder="Tập dữ liệu mới"
                                                    onChange={(e) => setNameDataset(e.target.value)}
                                                    className="h-10 pl-5 pr-20 transition-all ease-in-out border rounded-md outline-none sm:w-full w-72 duration-400 focus:ring-1 "
                                                    type="text"
                                                    required
                                                />
                                                <div className="absolute top-0 flex items-center h-full gap-2 right-1">
                                                    <button
                                                        className="flex items-center justify-center w-8 h-8 bg-red-400 rounded"
                                                        onClick={() => setOpend(false)}
                                                    >
                                                        <IoCloseOutline fontSize={25} color="white" />
                                                    </button>
                                                    <button
                                                        className="flex items-center justify-center w-8 h-8 bg-green-500 rounded"
                                                        onClick={() => addDataset()}
                                                    >
                                                        {loaderAddDateset ? (
                                                            <ReactLoading
                                                                type="spin"
                                                                width={24}
                                                                height={24}
                                                                color="white"
                                                            />
                                                        ) : (
                                                            <IoAdd fontSize={25} color="white" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="font-semibold text-md">Chế độ truy cập</div>
                                <div className="flex gap-5 ">
                                    {isPublish ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                className="w-4 h-full"
                                                type="radio"
                                                defaultChecked
                                                onChange={(e) => setIsPublish(e.target.checked)}
                                                name="accessibility"
                                                id="pub"
                                            />
                                            <label htmlFor="pub" className="text-base">
                                                Công khai
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <input
                                                className="w-4 h-full"
                                                type="radio"
                                                onChange={(e) => setIsPublish(e.target.checked)}
                                                name="accessibility"
                                                id="pub"
                                            />
                                            <label htmlFor="pub" className="text-base">
                                                Công khai
                                            </label>
                                        </div>
                                    )}
                                    {!isPublish ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                className="w-4 h-full "
                                                type="radio"
                                                name="accessibility"
                                                defaultChecked
                                                onChange={(e) => setIsPublish(e.target.checked)}
                                                id="prt"
                                            />
                                            <label htmlFor="prt" className="text-base">
                                                Riêng tư
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <input
                                                className="w-4 h-full "
                                                type="radio"
                                                name="accessibility"
                                                onChange={(e) => setIsPublish(e.target.checked)}
                                                id="prt"
                                            />
                                            <label htmlFor="prt" className="text-base">
                                                Riêng tư
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="font-semibold text-md">Ngôn ngữ mặc định</div>
                                <Select
                                    className="w-auto"
                                    styles={{ border: 'none' }}
                                    placeholder="Language for chatbot to respond in"
                                    options={options}
                                    defaultValue={options[0]}
                                    onChange={(selectedOption) => setLangue(selectedOption)}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="font-semibold text-md">
                                    Lệnh điều khiển bot:
                                    <span className="font-medium text-gray-400">({lengths}/200) Token</span>
                                </div>
                                <textarea
                                    onChange={(e) => setPrompt(e.target.value)}
                                    id="message"
                                    defaultValue={prompt}
                                    rows="4"
                                    style={{
                                        borderColor: err && 'errors',
                                        borderWidth: err && '1px',
                                        boxShadow: err && 'rgb(229, 62, 62) 0px 0px 0px 1px',
                                    }}
                                    className="block w-full p-3 text-base transition-all ease-in-out border border-gray-300 rounded-md bg-gray-50 duration-400 focus:ring-1"
                                    placeholder="Viết suy nghĩ của bạn ở đây..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <Styling setStyle={setStyle} chatSetting={chatSetting} />
                    <div className="flex justify-end gap-2 pt-5">
                        <Link to="/dashboard">
                            <div className=" flex items-center cursor-pointer text-base font-bold px-4 h-10 bg-[#edf2f7] rounded-md ">
                                Hủy bỏ
                            </div>
                        </Link>
                        {lengths > 200 ? (
                            <div className="flex items-center h-10 px-4 text-base font-bold text-white bg-gray-500 rounded-md cursor-pointer ">
                                Cập nhật
                            </div>
                        ) : (
                            <div
                                onClick={() => updateSetting()}
                                className="flex items-center h-10 px-4 text-base font-bold text-white bg-black rounded-md cursor-pointer "
                            >
                                Cập nhật
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Setting;
