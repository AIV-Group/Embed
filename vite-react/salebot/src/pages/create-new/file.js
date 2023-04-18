import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import useStore from '../../hooks/useStore';
import './style.css';

const File = () => {
    const [file, setFile] = useState(null);
    const [loader, setLoader] = useState(false);
    const [messages, setMessages] = useState('');
    const [state, dispatch] = useStore();
    const token = state.user.access_token;
    const userId = state.user.user_id;
    const [name, setName] = useState('');
    const [isRole, setIsRole] = useState('ANSWER_QUESTION');
    const refInput = useRef();

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setFile(file);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleCreateFile = async () => {
        if (!name) return setFocus();
        setLoader(true);

        const formdata = new FormData();

        formdata.append('train_data', file);
        formdata.append('name', name);
        formdata.append('created_by', userId);
        formdata.append('system_message', 'nói chuyện thân thiện');
        formdata.append('type_bot', isRole);

        try {
            const res = await axiosClient.post(`bots/`, formdata, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (res) {
                setLoader(false);
                setMessages('');
            }
        } catch (error) {
            console.log('this error', error);
            setLoader(false);
            setMessages('Thêm thất bại');
        }
    };
    const setFocus = () => refInput.current.focus();
    return (
        <div>
            <h1 className="pt-12 pb-12 text-4xl font-bold text-center">Tạo mới Chatbot</h1>

            <div className="w-full max-w-2xl mx-auto mobile-box">
                {file ? (
                    <div>
                        <h1 className="pb-4 text-lg font-bold">Tên:</h1>
                        <input
                            ref={refInput}
                            placeholder="Tên Chatbot"
                            name="name"
                            value={name}
                            required
                            onChange={(e) => setName(e.target.value)}
                            className="py-3 mb-4  border border-0 border-slate-400 text-gray-900 text-sm rounded-lg outline outline-2 outline-slate-200 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                    </div>
                ) : null}
                <label
                    htmlFor="dropzone-file"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                    {file ? (
                        <div>
                            <div>
                                <div className="flex items-center mb-4 textinside">
                                    <p className="text-lg font-bold ">Tệp đã chọn: </p>
                                    <p className="ml-3 text-base">{file.name}</p>
                                </div>
                                <div className="flex items-center textinside">
                                    <p className="text-lg font-bold ">kích thước tệp:</p>
                                    <p className="ml-2 text-base">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                                aria-hidden="true"
                                className="w-10 h-10 mb-3 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">Nhấp để tải lên</span> hoặc kéo và thả
                            </p>
                        </div>
                    )}
                    <input
                        id="dropzone-file"
                        accept=".txt"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </label>
                {file?.name ? (
                    <>
                        <div className="flex mt-8 mb-12 mb-resp">
                            <button
                                className={`px-12 py-6 mr-5 rounded-lg border-slate-400 outline outline-2 box-hover ${
                                    isRole === 'CUSTOMER_SERVICE' ? 'outline-black' : 'outline-slate-200 '
                                }`}
                                style={{ width: '326px' }}
                                onClick={() => setIsRole('CUSTOMER_SERVICE')}
                            >
                                <span className="text-sm font-bold">Dịch vụ khách hàng</span>
                            </button>
                            <button
                                className={`px-12 py-6 mr-5 rounded-lg border-slate-400 outline outline-2 box-hover ${
                                    isRole === 'ANSWER_QUESTION' ? 'outline-black' : 'outline-slate-200 '
                                }`}
                                style={{ width: '326px' }}
                                onClick={() => setIsRole('ANSWER_QUESTION')}
                            >
                                <span className="text-sm font-bold">Trả lời câu hỏi về dữ liệu</span>
                            </button>
                        </div>
                        <div className="flex justify-end function-btn">
                            <div className="mr-5 text-right">
                                {loader ? (
                                    <button className="py-3 mb-12 text-base font-medium text-white bg-black rounded-lg px-14">
                                        Đang tải...
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleCreateFile()}
                                        className="py-3 mb-12 text-base font-medium text-white bg-black rounded-lg px-14"
                                    >
                                        Tạo
                                    </button>
                                )}
                            </div>
                            <div className="text-right ">
                                <Link to="/create_new">
                                    <button className="py-3 mb-12 text-base font-medium text-white bg-black rounded-lg px-14">
                                        Quay lại
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="mt-8 text-right">
                        <Link to="/create_new">
                            <button className="py-3 mb-12 text-base font-medium text-white bg-black rounded-lg px-14">
                                Quay lại
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default File;
