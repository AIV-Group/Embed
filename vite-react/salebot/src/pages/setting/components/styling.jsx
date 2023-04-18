import { useEffect, useRef, useState } from 'react';
import { SketchPicker } from 'react-color';
import { TbMessageCircle2 } from 'react-icons/tb';
import Popup from '../../../components/popup';
import useOnclickOutside from '../../../hooks/useOnclickOutside';
const Styling = ({ setStyle, chatSetting }) => {
    const [colorBg, setColorBg] = useState();
    const [colorBotText, setColorBotText] = useState();
    const [colorBotBg, setColorBotBg] = useState();
    const [colorUserText, setColorUserText] = useState();
    const [colorUserBg, setColorUserBg] = useState();
    const [colorWidgetBg, setColorWidgetBg] = useState();
    const [userMes, setUserMes] = useState('Chào bạn');

    const [headingValue, setHeadingValue] = useState('');
    const [subHeadingValue, setSubHeadingValue] = useState('');
    const [firtMesseage, setFirtMessage] = useState('');

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [isUserPickerOpen, setIsUserPickerOpen] = useState(false);
    const [isUserPickerBgOpen, setIsUserPickerBgOpen] = useState(false);
    const [isBotPickerOpen, setIsBotPickerOpen] = useState(false);
    const [isBotPickerBgOpen, setIsBotPickerBgOpen] = useState(false);
    const [isWidgetPickerOpen, setIsWidgetPickerOpen] = useState(false);

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const colorRef = useRef(null);
    const colorUserRef = useRef(null);
    const colorUserBgRef = useRef(null);
    const colorBotRef = useRef(null);
    const colorBotBgRef = useRef(null);
    const colorWidgetRef = useRef(null);

    useOnclickOutside(colorRef, () => setIsPickerOpen(false));
    useOnclickOutside(colorUserRef, () => setIsUserPickerOpen(false));
    useOnclickOutside(colorUserBgRef, () => setIsUserPickerBgOpen(false));
    useOnclickOutside(colorBotRef, () => setIsBotPickerOpen(false));
    useOnclickOutside(colorBotBgRef, () => setIsBotPickerBgOpen(false));
    useOnclickOutside(colorWidgetRef, () => setIsWidgetPickerOpen(false));

    const handleChange = (color, action) => {
        action(color.hex);
    };

    const handlePopupOpen = (e) => {
        firtMesseage?.split(' ').length > 10 ? setIsPopupOpen(true) : e.preventDefault();
    };

    const moveCaretAtEnd = (e) => {
        const temp_value = e.target.value;
        e.target.value = '';
        e.target.value = temp_value;
    };

    useEffect(() => {
        setColorBg(chatSetting?.boxChat_backgroundColor ? chatSetting?.boxChat_backgroundColor : '#D81F36');
        setColorBotText(chatSetting?.botM_color ? chatSetting?.botM_color : '#000000');
        setColorBotBg(chatSetting?.botM_backgroundColor ? chatSetting?.botM_backgroundColor : '#edf2f7');
        setColorUserText(chatSetting?.userM_color ? chatSetting?.userM_color : '#fff');
        setColorUserBg(chatSetting?.userM_backgroundColor ? chatSetting?.userM_backgroundColor : '#D81F36');
        setColorWidgetBg(chatSetting?.boxChat_colorWidgetBg ? chatSetting?.boxChat_colorWidgetBg : '#D81F36');
        setHeadingValue(chatSetting?.boxChat_title ? chatSetting?.boxChat_title : '');
        setSubHeadingValue(chatSetting?.boxChat_subTitle ? chatSetting?.boxChat_subTitle : '');
        setFirtMessage(chatSetting?.isMessage ? chatSetting?.isMessage : '');
    }, [chatSetting]);

    useEffect(() => {
        const newSetting = {
            isMessage: firtMesseage,

            userM_backgroundColor: colorUserBg,
            userM_color: colorUserText,

            botM_backgroundColor: colorBotBg,
            botM_color: colorBotText,

            boxChat_backgroundColor: colorBg,
            boxChat_title: headingValue,
            boxChat_subTitle: subHeadingValue,
            boxChat_colorWidgetBg: colorWidgetBg,
        };
        return setStyle(newSetting);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        colorBg,
        colorBotText,
        colorBotBg,
        colorUserText,
        colorUserBg,
        colorWidgetBg,
        headingValue,
        subHeadingValue,
        firtMesseage,
    ]);

    return (
        <div className=" border border-[#A0AEC0] rounded-md p-5 shadow-xl">
            <div className="w-full mb-8 text-xl font-bold">Tùy chỉnh giao diện boxchat</div>
            <div className="flex gap-8 md:flex-col ">
                <div className="flex flex-col flex-grow-[1] flex-shrink-[1] flex-basis-[0] gap-3">
                    <div className="text-lg font-semibold">Thông tin chatbot</div>
                    <div className="flex flex-col gap-1">
                        <div className="text-sm  font-semibold text-[#4a5568]">Tên chatbot: </div>
                        <input
                            className="w-full h-10 pl-5 transition-all ease-in-out border rounded-md outline-none duration-400 focus:ring-1 "
                            type="text"
                            value={headingValue}
                            placeholder="Eg: Tên chatbot của bạn"
                            onChange={(e) => setHeadingValue(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="text-sm  font-semibold text-[#4a5568]">Mô tả chatbot: </div>
                        <input
                            className="w-full h-10 pl-5 transition-all ease-in-out border rounded-md outline-none duration-400 focus:ring-1 "
                            type="text"
                            placeholder="Eg: Hỏi về chúng tôi bất cứ điều gì"
                            onChange={(e) => setSubHeadingValue(e.target.value)}
                            value={subHeadingValue}
                        />
                    </div>
                    <div className="relative flex items-center gap-3 ">
                        <div className="text-sm  text-[#4a5568] font-semibold w-[90px]">Màu nền: </div>
                        <div
                            className="h-6 rounded-lg shadow-md cursor-pointer w-14"
                            style={{
                                backgroundColor: colorBg,
                            }}
                            ref={colorRef}
                            onClick={() => setIsPickerOpen(true)}
                        />
                        {isPickerOpen && (
                            <div ref={colorRef} className="absolute z-50 transition-all ease-in-out top-8 duration-400">
                                <SketchPicker onChange={(e) => handleChange(e, setColorBg)} color={colorBg} />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="font-semibold text-md">Tin nhắn chào mừng</div>
                        <Popup isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen}>
                            <textarea
                                onChange={(e) => setFirtMessage(e.target.value)}
                                value={firtMesseage}
                                className="block w-[350px] fadeIn duration-100 sm:w-[300px] h-[350px] text-base transition-all ease-in-out border-transparent"
                                placeholder="Viết suy nghĩ của bạn ở đây..."
                                autoFocus
                                onFocus={moveCaretAtEnd}
                            />
                        </Popup>
                        <input
                            onChange={(e) => setFirtMessage(e.target.value)}
                            onClick={(e) => handlePopupOpen(e)}
                            value={firtMesseage}
                            className="w-full h-10 pl-5 transition-all ease-in-out border rounded-md outline-none duration-400 focus:ring-1 "
                            type="text"
                            placeholder="Thông báo đầu tiên hiển thị cho khách truy cập của bạn"
                        />
                        <div className="font-semibold text-md">Tin nhắn người dùng</div>
                        <input
                            onChange={(e) => setUserMes(e.target.value)}
                            value={userMes}
                            className="w-full h-10 pl-5 transition-all ease-in-out border rounded-md outline-none duration-400 focus:ring-1 "
                            type="text"
                            placeholder="Tin nhắn của người dùng"
                        />
                    </div>
                    <div className="relative flex flex-col gap-3 py-3">
                        <div className="font-semibold text-md">Tin nhắn bot </div>
                        <div className="flex gap-3">
                            <div className="text-sm  text-[#4a5568] font-semibold w-[90px]">Màu chữ: </div>
                            <div
                                className="h-6 rounded-lg shadow-md cursor-pointer w-14"
                                style={{
                                    backgroundColor: colorBotText,
                                }}
                                onClick={() => setIsBotPickerOpen(true)}
                            />
                            {isBotPickerOpen && (
                                <div
                                    ref={colorBotRef}
                                    className="absolute z-50 transition-all ease-in-out top-8 duration-400"
                                >
                                    <SketchPicker
                                        onChange={(e) => handleChange(e, setColorBotText)}
                                        color={colorBotText}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <div className="text-sm  text-[#4a5568] font-semibold w-[90px]">Màu nền: </div>
                            <div
                                className="h-6 rounded-lg shadow-md cursor-pointer w-14"
                                style={{
                                    backgroundColor: colorBotBg,
                                }}
                                onClick={() => setIsBotPickerBgOpen(true)}
                            />
                            {isBotPickerBgOpen && (
                                <div
                                    ref={colorBotBgRef}
                                    className="absolute z-50 transition-all ease-in-out top-8 duration-400"
                                >
                                    <SketchPicker onChange={(e) => handleChange(e, setColorBotBg)} color={colorBotBg} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="relative flex flex-col gap-3 py-3 ">
                        <div className="font-semibold text-md">Tin nhắn người dùng </div>
                        <div className="flex gap-3">
                            <div className="text-sm  text-[#4a5568] font-semibold w-[90px]">Màu chữ: </div>
                            <div
                                className="h-6 rounded-lg shadow-md cursor-pointer w-14"
                                style={{
                                    backgroundColor: colorUserText,
                                }}
                                onClick={() => setIsUserPickerOpen(true)}
                            />
                            {isUserPickerOpen && (
                                <div
                                    ref={colorUserRef}
                                    className="absolute z-50 transition-all ease-in-out top-8 duration-400"
                                >
                                    <SketchPicker
                                        onChange={(e) => handleChange(e, setColorUserText)}
                                        color={colorUserText}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <div className="text-sm  text-[#4a5568] font-semibold w-[90px]">Màu nền: </div>
                            <div
                                className="h-6 rounded-lg shadow-md cursor-pointer w-14"
                                style={{
                                    backgroundColor: colorUserBg,
                                }}
                                onClick={() => setIsUserPickerBgOpen(true)}
                            />
                            {isUserPickerBgOpen && (
                                <div
                                    ref={colorUserBgRef}
                                    className="absolute z-50 transition-all ease-in-out top-8 duration-400"
                                >
                                    <SketchPicker
                                        onChange={(e) => handleChange(e, setColorUserBg)}
                                        color={colorUserBg}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="relative flex flex-col gap-3 pt-3">
                        <div className="font-semibold text-md">Biểu tượng chatbot</div>
                        <div className="flex gap-3">
                            <div className="text-sm  text-[#4a5568] font-semibold w-[90px]">Màu nền: </div>
                            <div
                                className="h-6 rounded-lg shadow-md cursor-pointer w-14"
                                style={{
                                    backgroundColor: colorWidgetBg,
                                }}
                                onClick={() => setIsWidgetPickerOpen(true)}
                            />
                            {isWidgetPickerOpen && (
                                <div
                                    ref={colorWidgetRef}
                                    className="absolute z-50 transition-all ease-in-out top-8 duration-400"
                                >
                                    <SketchPicker
                                        onChange={(e) => handleChange(e, setColorWidgetBg)}
                                        color={colorWidgetBg}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="bg-custom  w-[36rem] sm:w-[100%] rounded-xl">
                    <div className="mt-20 mx-auto  max-w-[400px] sm:w-[90%] ">
                        <div className="h-[500px] sm:h-full sm:pb-5 rounded-xl bg-white shadow-md">
                            <div
                                className={`px-5 py-[10px] bg-[${colorBg}] w-full text-white rounded-t-xl`}
                                style={{ backgroundColor: colorBg }}
                            >
                                <div className="text-xl font-bold">
                                    {headingValue !== '' ? headingValue : 'Tiêu đề'}
                                </div>
                                <div className="text-sm font-normal">
                                    {subHeadingValue !== '' ? subHeadingValue : 'Tiêu đề phụ'}
                                </div>
                            </div>
                            <div className=" pt-4 px-4 h-[400px] sm:h-full  flex gap-5 flex-col ">
                                <div className="flex justify-start">
                                    <div
                                        className="w-fit bg-[#edf2f7] p-5 rounded-xl sm:p-3"
                                        style={{ backgroundColor: colorBotBg, color: colorBotText }}
                                    >
                                        {firtMesseage !== ''
                                            ? firtMesseage
                                            : '🤖 Đây là GPT SaleBot, chatbot thông minh thế hệ mới dựa trên ChatGPT, được phát triển bởi Công ty CP Công nghệ và Truyền thông AIV Group 🤖 Dùng thử tại gptsalebot.com 🤖 Xin mời đặt câu hỏi, chúng tôi đã sẵn sàng để giải đáp các thắc mắc'}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div
                                        className="p-5 text-white w-fit rounded-xl sm:p-3"
                                        style={{ backgroundColor: colorUserBg, color: colorUserText }}
                                    >
                                        {userMes}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end my-8">
                            <div
                                className="flex items-center h-[60px] w-[60px] rounded-full cursor-pointer"
                                style={{ backgroundColor: colorWidgetBg }}
                            >
                                <TbMessageCircle2 className="text-[32px] mx-auto text-white fill-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Styling;
