import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IoArrowBack } from 'react-icons/io5';
import ReactLoading from 'react-loading';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import InputController from '../../components/inputController';
import { Notification } from '../../components/notification';
import TextAreaController from '../../components/textareaController';
import useStore from '../../hooks/useStore';
import './style.css';
import { get_encoding, encoding_for_model } from '@dqbd/tiktoken';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import Debounced from '../../components/utils/useDebouced';

const Text = () => {
    const [state, dispatch] = useStore();
    const [loader, setLoader] = useState(false);
    const created_by = state.user.user_id;
    const [lengths, setLenghts] = useState('');
    const history = useNavigate();
    const [err, setErr] = useState(false);
    const [system, setSystem] = useState(
        'Hãy nhập vai Chatbot tư vấn, bán hàng và cố gắng trả lời câu hỏi của khách hàng ngắn gọn, chính xác nhất. Nội dung trả lời không vượt quá 200 từ. Xưng tôi, gọi khách hàng là quý khách.',
    );

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm({
        defaultValues: {
            // system_prompt: system,
            name: '',
            title: '',
            sub_title: '',
            dataset_name: '',
        },
    });
    const useDebounced = Debounced(system, 300);

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

    const handleInputChange = async (value) => {
        setSystem(value);
    };

    useEffect(() => {
        getTiktoken(useDebounced);
    }, [useDebounced]);

    const onSubmit = async (data) => {
        if (lengths > 200) return;
        if (system?.length < 1) return setErr(true);
        setLoader(true);

        const payload = {
            name: data.name,
            datasets: [{ name: data.dataset_name, isAnswer: true }],
            created_by: created_by,
            system_prompt: system,
            type_dataset: 0,
            // languageCode: 1,
            isPublic: false,
            isMessage:
                '🤖 Đây là GPT SaleBot, chatbot thông minh thế hệ mới dựa trên ChatGPT, được phát triển bởi Công ty CP Công nghệ và Truyền thông AIV Group 🤖 Dùng thử tại gptsalebot.com 🤖 Xin mời đặt câu hỏi, chúng tôi đã sẵn sàng để giải đáp các thắc mắc',
            userM_backgroundColor: '#D81F36',
            userM_color: '#fff',
            botM_backgroundColor: '#edf2f7',
            botM_color: '#000000',
            boxChat_backgroundColor: '#D81F36',
            boxChat_title: data.title,
            boxChat_subTitle: data.sub_title,
            boxChat_colorWidgetBg: '#D81F36',
            // system_prompt: data?.system_prompt,
        };
        try {
            const res = await axiosClient.post('bots/', payload);
            if (res.status === 200 || res.status === 201) {
                setLoader(false);
                Notification('Thành công', 'Tạo thành công chatbot', 'success');

                history(`/${res?.data?.id}/chat/${res?.data?.datasets[0]?.id}/train_text`);
            } else {
                setLoader(false);
                Notification('Thất bại', 'Không tạo được chatbot', 'danger');
            }
        } catch (error) {
            Notification('Thất bại', 'Không tạo được chatbot', 'danger');
            setLoader(false);
        }
    };

    return (
        <div className="sm:px-2">
            <div className="hidden w-full max-w-5xl gap-4  mt-8 mb-5 mx-4 sm:block">
                <IoArrowBack className="text-[32px] cursor-pointer" onClick={() => history(-1)} />
            </div>
            <h1 className="pt-12 pb-12 text-4xl font-bold text-center sm:pt-2 sm:text-3xl">Tạo Chatbot mới</h1>
            <div className="block w-full max-w-5xl gap-4 mx-auto mb-5 sm:hidden">
                <IoArrowBack className="text-[32px] cursor-pointer" onClick={() => history(-1)} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="container max-w-2xl mx-auto mobile-box">
                <h1 className="pb-1 text-lg font-bold">Tên chatbot:</h1>
                <InputController
                    placeholder="Tên Chatbot"
                    name="name"
                    required={true}
                    control={control}
                    type="text"
                    errors={errors}
                />
                <h1 className="pb-1 mt-4 text-lg font-bold">Tiêu đề chatbot:</h1>
                <InputController
                    placeholder="Tiêu đề Chatbot"
                    name="title"
                    required={true}
                    control={control}
                    type="text"
                    errors={errors}
                />
                <h1 className="pb-1 mt-4 text-lg font-bold">Tiêu đề phụ chatbot:</h1>
                <InputController
                    placeholder="Tiêu đề phụ Chatbot"
                    name="sub_title"
                    required={true}
                    control={control}
                    type="text"
                    errors={errors}
                />

                <h1 className="pb-1 mt-4 text-lg font-bold">Tên tập dữ liệu huấn luyện:</h1>

                <InputController
                    placeholder="Bộ dữ liệu chatbot"
                    name="dataset_name"
                    required={true}
                    control={control}
                    type="text"
                    errors={errors}
                />
                <h1 className="pb-1 mt-4 text-lg font-bold">
                    Lệnh điều khiển bot:{' '}
                    <span className="font-medium text-gray-400 text-[15px]">({lengths}/200)Token</span>
                </h1>
                <textarea
                    className="w-full p-4 pt-2 transition-all ease-in-out border sm:h-[200px] h-[150px] rounded-md outline-none duration-400 focus:ring-1"
                    onChange={(e) => handleInputChange(e.target.value)}
                    defaultValue={system}
                    // required
                    placeholder="Hãy nhập vai Chatbot tư vấn, bán hàng và cố gắng trả lời câu hỏi của khách hàng ngắn gọn, chính xác nhất. Nội dung trả lời không vượt quá 200 từ. Xưng tôi, gọi khách hàng là quý khách."
                    style={{
                        borderColor: err && 'errors',
                        borderWidth: err && '1px',
                        boxShadow: err && 'rgb(229, 62, 62) 0px 0px 0px 1px',
                    }}
                />
                {/* <TextAreaController
                    placeholder="Hãy nhập vai Chatbot tư vấn, bán hàng và cố gắng trả lời câu hỏi của khách hàng ngắn gọn, chính xác nhất. Nội dung trả lời không vượt quá 200 từ. Xưng tôi, gọi khách hàng là quý khách."
                    name="system_prompt"
                    required={true}
                    control={control}
                    errors={errors}
                    onkeyUpValue={handleInputChange}
                /> */}
                <div className="flex justify-end mt-6 function-btn">
                    <div className="text-right sm:w-full sm:justify-center">
                        {loader ? (
                            <button className="py-3 mb-12 sm:w-full text-base font-medium text-white bg-black text-center rounded-lg px-14 w-[150px]">
                                <ReactLoading type="spin" width={24} height={24} color="white" />
                            </button>
                        ) : lengths < 200 ? (
                            <button className="py-3 sm:w-full mb-12 text-base font-medium text-white text-center bg-black rounded-lg px-14 w-[150px]">
                                Tạo
                            </button>
                        ) : (
                            <div className="py-3 mb-12 text-base sm:w-full font-medium text-white text-center bg-gray-500 rounded-lg px-14 w-[150px]">
                                Tạo
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Text;
