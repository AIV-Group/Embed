import { Link } from 'react-router-dom';
const Website = () => {
    return (
        <div>
            <h1 className="pt-12 pb-12 text-4xl font-bold text-center">Tạo mới Chatbot</h1>
            <div className="container max-w-2xl px-4 mx-auto mobile-box">
                <h1 className="pb-4 text-lg font-bold">Tên:</h1>
                <input
                    placeholder="Tên Chatbot"
                    name="name"
                    className="py-3  border border-0 border-slate-400 text-gray-900 text-sm rounded-lg outline outline-2 outline-slate-200 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></input>
                <h1 className="pt-4 pb-4 text-lg font-bold">Địa chỉ website:</h1>
                <input
                    placeholder="https://..."
                    name="name"
                    className="py-3   border border-0 border-slate-400 text-gray-900 text-sm rounded-lg outline outline-2 outline-slate-200 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></input>
                <h1 className="py-4 text-lg font-bold">Vai trò của Chatbot:</h1>
                <div className="flex mb-12 mb-resp">
                    <button
                        className="px-12 py-6 mr-5 border border-0 rounded-lg border-slate-400 outline outline-2 outline-slate-200 box-hover"
                        style={{ width: '326px' }}
                    >
                        <span className="text-sm font-bold">Dịch vụ khách hàng</span>
                    </button>
                    <button
                        className="px-4 py-6 border border-0 rounded-lg border-slate-400 outline outline-2 outline-slate-200 box-hover"
                        style={{ width: '326px' }}
                    >
                        <span className="text-sm font-bold">Trả lời câu hỏi về dữ liệu</span>
                    </button>
                </div>
                <div className="flex justify-end function-btn">
                    <div className="mr-5 text-right">
                        <button className="py-3 mb-12 text-base font-medium text-white bg-black rounded-lg px-14">
                            Tạo
                        </button>
                    </div>
                    <div className="text-right ">
                        <Link to="/create_new">
                            <button className="py-3 mb-12 text-base font-medium text-white bg-black rounded-lg px-14">
                                Quay lại
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Website;
