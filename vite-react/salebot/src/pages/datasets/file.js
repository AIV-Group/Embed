import React, { useState } from 'react';
import './../create-new/style.css';

const UpdateWithFile = () => {
    const [file, setFile] = useState(null);

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setFile(file);
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleGoBack = () => {
        window.history.back();
    };
    return (
        <div>
            <h1 className="pt-12 pb-12 text-4xl font-bold text-center">Huấn luyện chatbot</h1>

            <div className=" w-full max-w-2xl mx-auto mobile-box">
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
                                    <p className="text-lg font-bold ">Kích thước tập tin:</p>
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
                    <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
                </label>
                {file?.name ? (
                    <div className="flex justify-end mt-5 function-btn">
                        <div className="mr-5 text-right">
                            <button className="py-3 mb-12 text-base font-medium text-white bg-black rounded-lg px-14">
                                Cập nhật
                            </button>
                        </div>
                        <div className="text-right ">
                            <button
                                className="py-3 mb-12 text-base font-medium text-white bg-black rounded-lg px-14"
                                onClick={handleGoBack}
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-8 text-right">
                        <button
                            className="py-3 mb-12 text-base font-medium text-white bg-black rounded-lg px-14"
                            onClick={handleGoBack}
                        >
                            Quay lại
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UpdateWithFile;
