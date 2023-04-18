const UpdateWithWebsite = () => {
    const handleGoBack = () => {
        window.history.back();
    };
    return (
        <div>
            <h1 className="pt-12 pb-12 text-4xl font-bold text-center">Huấn luyện chatbot</h1>
            <div className="container max-w-2xl mx-auto mobile-box">
                <h1 className="pt-4 pb-4 text-lg font-bold">URL trang web:</h1>
                <input
                    placeholder="https://..."
                    name="name"
                    className="py-3   border border-0 border-slate-400 text-gray-900 text-sm rounded-lg outline outline-2 outline-slate-200 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                ></input>

                <div className="flex justify-end pt-8 function-btn">
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
            </div>
        </div>
    );
};

export default UpdateWithWebsite;
