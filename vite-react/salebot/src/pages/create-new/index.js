import { Link } from 'react-router-dom';
import './style.css';
const CreateNew = () => {
    return (
        <div className="create_new">
            <h1 className="pt-10 text-4xl font-bold text-center sm:text-3xl">Tạo mới Chatbot</h1>
            <div className="flex justify-center mt-12 flex-mobile min-h-[70vh] sm:min-h-[56vh]">
                <Link to="/create/text">
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
                    <button className="flex px-16 py-5 mr-10 text-lg font-medium rounded-lg bg-gray-50 r">
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

                        <span className="ml-2 font-semibold">Tệp</span>
                    </button>
                </Link>
                <Link>
                    <button className="flex py-5 mr-10 text-lg font-medium rounded-lg px-14 bg-gray-50 ">
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

                        <span className="ml-2 font-semibold">Trang web</span>
                    </button>
                </Link> */}
            </div>
        </div>
    );
};

export default CreateNew;
