import { useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { MdOutlineContentCopy } from 'react-icons/md';
import { AxiosPatchAPI } from '../api';
import axiosClient from '../api/axiosClient';
import { ReactComponent as Loader } from '../assets/images/loading.svg';
import useOnclickOutside from '../hooks/useOnclickOutside';
import useStore from '../hooks/useStore';
import { Notification } from './notification';
export default function AddToWebsite({ data, opend, handleOpen }) {
    const [messages, setMessages] = useState('');
    const [loader, setLoader] = useState(false);
    const [isActive, setIsActive] = useState(data?.isPublic);
    const [state, dispatch] = useStore();
    const [coppy, setCopy] = useState('blue');
    const token = state.user.access_token;
    const ref = useRef();

    useOnclickOutside(ref, () => handleOpen(null));

    const cdnString = () => {
        if (data)
            return `<script
        src="${process.env.REACT_APP_CDN_SCRIPT}"
        data-chat-service="Salebot"
        data-bot-id="${data?.id}"
        data-chat-width="450px"
        data-chat-height="600px"
        data-bubble-color="${data?.boxChat_colorWidgetBg}"
    ></script>`;
    };

    const handleIsPublish = (value) => {
        isPublish(value);
    };

    const handleClose = () => {
        handleOpen(null);
    };

    const isPublish = async (checked) => {
        setLoader(true);
        const idBot = data?.id;
        const payload = {
            isPublic: checked,
            system_prompt: data?.system_prompt,
        };
        try {
            const res = await axiosClient.patch(`bots/${idBot}/`, payload);
            if (res.status === 200 || res.status === 201) {
                setIsActive(res?.data.isPublic);
                setLoader(false);
            } else {
                setLoader(false);
                setMessages('Không lấy được link thêm vào website');
            }
        } catch (err) {
            setLoader(false);
            setIsActive(false);
            setMessages('Không lấy được link thêm vào website');
        }
    };
    const copyToClipBoard = async (copyMe) => {
        try {
            await navigator.clipboard.writeText(copyMe);
            Notification('Thành công', 'Chia sẻ thành công', 'success');
        } catch (err) {
            Notification('Thất bại', 'Không thể chia sẻ', 'danger');
        }
    };

    return (
        <div>
            {opend === data?.id && (
                <div
                    className="absolute bg-white rounded right-0 sm:right-auto w-[500px] sm:w-[310px] bottom-9"
                    style={{ boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}
                    ref={ref}
                >
                    <div className="flex  justify-between px-5 pt-3 pb-2 border-b">
                        <div className="flex flex-wrap items-center">
                            <h3 className="text-lg font-bold">Thêm vào website</h3>
                            <label
                                onClick={() => handleIsPublish(!isActive)}
                                className="relative inline-flex items-center ml-4 mr-2 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={isActive ? true : false}
                                    value={isActive}
                                    className="sr-only peer"
                                    readOnly
                                />

                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                            <p className="text-sm text-blue-300 ">(Công khai sale bot)</p>
                        </div>
                        <button onClick={() => handleClose()}>
                            <IoMdClose fontSize={25} />
                        </button>
                    </div>
                    {loader ? (
                        <div className="bg-gray-500 bg-opacity-5 h-[150px]">
                            <div className="w-[35px] pt-12 mx-auto">
                                <Loader style={{ width: '100%' }} />
                            </div>
                        </div>
                    ) : isActive ? (
                        <div className="pb-5">
                            <p className="flex flex-wrap items-center px-5 mt-2 mb-3 text-gray-500 sm:mb-3 sm:flex-row-reverse">
                                Sao chép và thêm đoạn mã sau vào html trang web của bạn:{' '}
                                <MdOutlineContentCopy
                                    onClick={() => {
                                        copyToClipBoard(cdnString());
                                        setCopy('gray');
                                    }}
                                    className="sm:mt-2 sm:text-right"
                                    color={coppy}
                                    style={{ marginLeft: '5px' }}
                                />
                            </p>
                            <div className="p-5 pt-0 pb-0 ">
                                <div
                                    onClick={() => copyToClipBoard(cdnString())}
                                    className="p-2 text-gray-500 rounded bg-slate-100 sm:text-[11px]"
                                    style={{ fontFamily: 'monospace' }}
                                >
                                    {cdnString()}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {messages ? (
                                <p className="text-center pb-5 h-[150px] pt-12 sm:px-3 text-gray-400">{messages}</p>
                            ) : (
                                <p className="text-center pb-5 h-[150px] pt-12 sm:px-3 text-gray-400">
                                    Bật quyền truy cập công khai cho chatbot
                                </p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
