import React, { useEffect, useRef, useState } from 'react';
import { IoIosCloseCircle } from 'react-icons/io';
import { TbMessageCircle2 } from 'react-icons/tb';
import ReactLoading from 'react-loading';
import ReactMarkdown from 'react-markdown';
import { useSearchParams } from 'react-router-dom';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { AxiosGetAPI } from '../../api';
import InputChat from '../../components/input';
import { SSE } from '../../pages/chat-app/sse';
const messageType = {
    user: 'user',
    assistant: 'assistant',
};
const Chatdemo = ({ open, setOpen }) => {
    const [messages, setMessages] = useState([]);
    const [loader, setLoader] = useState(false);
    const [question, setQuestion] = useState('');
    const chatRef = useRef();
    const [dataChat, setDataChat] = useState();
    const [loadingApp, setLoadingApp] = useState(false);
    const [isLoadingRes, setIsLoadingRes] = useState(false);
    const [checkSetW, setCheckSetW] = useState(true);
    const [param, setParam] = useSearchParams();
    const [datasetIds, setDatasetIds] = useState();

    const handleGetQuesiton = (value) => {
        setQuestion(value);
    };
    const idbot = decodeURIComponent(param.get('chat')).replaceAll('&#w#', '-');
    const idHistory = localStorage.getItem('w');

    useEffect(() => {
        idHistory ? setCheckSetW(false) : setCheckSetW(true);
    }, [question]);

    const arrDataset_ids = (data) => {
        const isAnswer = data?.filter((i) => i?.isAnswer === true).map((i) => i?.id);
        return setDatasetIds(isAnswer);
    };
    const handleSetID = (conversation_id) => {
        if (!idHistory) {
            localStorage.setItem('w', conversation_id);
        }
    };
    const resStream = async () => {
        if (!question) return;
        setLoader(true);
        setIsLoadingRes(true);
        const newMessages = [
            ...messages,
            {
                role: messageType.user,
                content: question,
            },
        ];
        const convert = [...datasetIds];
        setMessages(newMessages);
        let requestsQuestion = {
            dataset_ids: convert,
            question: question,
            system_message: dataChat?.system_prompt,
            conversation_id: idHistory ? idHistory : null,
            bot_id: idbot,
            history_chat: newMessages,
        };

        let source = new SSE(`${process.env.REACT_APP_URL_CHAT}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            payload: JSON.stringify(requestsQuestion),
        });

        source.addEventListener('message', (e) => {
            if (!testJSON(e?.data)) return;
            if (e.data !== '[DONE]' && e.data !== 'ping') {
                setLoader(false);
                const payload = JSON.parse(e?.data);
                if (payload) {
                    let text = payload?.answer;
                    const conversation_id = payload.conversation_id;
                    if (checkSetW) {
                        handleSetID(conversation_id);
                    }
                    if (text !== '\n') {
                        setMessages([
                            ...newMessages,
                            {
                                role: messageType.assistant,
                                content: text,
                            },
                        ]);
                    }
                }
            } else {
                source.close();
            }
        });

        source.addEventListener('readystatechange', (e) => {
            if (e.readyState >= 2) {
                setLoader(false);
                setIsLoadingRes(false);
            }
        });

        source.addEventListener('error', (e) => {
            if (e.data) {
                setMessages([
                    ...newMessages,
                    {
                        role: messageType.assistant,
                        content: 'Xin lỗi không thể phục vụ vào lúc này',
                    },
                ]);
            }
        });

        source.stream();
    };

    const handleOnKeyUp = (e) => {
        const searchValue = e.target.value.trim();
        if (e.key === 'Enter' && searchValue && !isLoadingRes) {
            setQuestion(searchValue);
            resStream();
            setQuestion('');
        }
    };
    const handleSubmit = () => {
        if (!isLoadingRes) {
            resStream();
            setQuestion('');
        }
    };

    const testJSON = (text) => {
        if (typeof text !== 'string') {
            return false;
        }
        try {
            var json = JSON.parse(text);
            return typeof json === 'object';
        } catch (error) {
            return false;
        }
    };

    //goi API color

    useEffect(() => {
        getStyleChatApp();
    }, [idbot]);

    const getStyleChatApp = async () => {
        setLoadingApp(true);
        try {
            const res = await AxiosGetAPI(`embed/bot/${idbot}`);
            if (res.status === 200 || res.status === 201) {
                setDataChat(res.data);
                arrDataset_ids(res?.data?.datasets);
                setLoadingApp(false);
                setMessages([
                    {
                        role: messageType.assistant,
                        content: res.data.isMessage,
                    },
                ]);
            }
        } catch (error) {
            setLoadingApp(false);
        }
    };

    useEffect(() => {
        if (chatRef?.current) {
            chatRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div>
            <div className="fixed bottom-0 z-50 right-7 sm:right-6">
                <div className=" mx-auto  sm:max-w-[90vw] max-w-[420px] w-full ">
                    {open ? (
                        <div className="bg-white shadow-xl rounded-xl">
                            <div
                                className={`px-5 py-[10px] bg-black  w-full text-white rounded-t-xl`}
                                style={{
                                    background: dataChat?.boxChat_backgroundColor && dataChat?.boxChat_backgroundColor,
                                }}
                            >
                                <div className="text-xl font-bold">
                                    {dataChat?.boxChat_title ? dataChat?.boxChat_title : 'Heading'}
                                </div>
                                <div className="text-sm font-normal">
                                    {dataChat?.boxChat_subTitle ? dataChat?.boxChat_subTitle : 'sub heading'}
                                </div>
                            </div>
                            <div className=" pt-4 px-4 h-[430px]  flex gap-5 flex-col " style={{ overflowY: 'auto' }}>
                                {messages?.map((item, idx) =>
                                    item?.role === 'assistant' ? (
                                        <div key={idx} className="flex justify-start">
                                            <div
                                                className="p-2 px-3 w-fit rounded-xl text-[14px]"
                                                style={{
                                                    background: dataChat?.botM_backgroundColor,
                                                    color: dataChat?.botM_color,
                                                    width: '88%',
                                                    fontFamily: 'sans-serif',
                                                }}
                                            >
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm, remarkMath]}
                                                    rehypePlugins={[rehypeKatex]}
                                                    className="markdown"
                                                    children={item?.content}
                                                    components={{
                                                        a: ({ href, children }) => (
                                                            <a href={href} target="_blank" rel="noopener noreferrer">
                                                                {children}
                                                            </a>
                                                        ),
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end" key={idx}>
                                            <div
                                                className="p-2 px-3 text-white w-fit rounded-xl text-[14px]"
                                                style={{
                                                    background: dataChat?.userM_backgroundColor,
                                                    color: dataChat?.userM_color,
                                                    width: '88%',
                                                    fontFamily: 'sans-serif',
                                                }}
                                            >
                                                {item?.content}
                                            </div>
                                        </div>
                                    ),
                                )}
                                {loader && <ReactLoading type="bubbles" color="gray" />}
                                <div ref={chatRef} />
                            </div>

                            <div>
                                <InputChat
                                    css="custom-input-chat"
                                    handleOnKeyUp={handleOnKeyUp}
                                    handleSubmit={handleSubmit}
                                    placeholder="Nội dung chat"
                                    getValue={handleGetQuesiton}
                                    question={question}
                                    isLoadingRes={isLoadingRes}
                                />
                            </div>
                        </div>
                    ) : null}

                    <div className="flex justify-end my-8 mt-5">
                        <div
                            className="flex items-center z-[999] shadow bg-black h-[60px] w-[60px] rounded-full cursor-pointer"
                            style={{ background: 'rgb(216, 31, 54)' }}
                        >
                            {!open ? (
                                <TbMessageCircle2
                                    onClick={() => setOpen(!open)}
                                    className="text-[32px] mx-auto text-white fill-white"
                                />
                            ) : (
                                <IoIosCloseCircle
                                    onClick={() => setOpen(!open)}
                                    className="text-[32px] mx-auto text-white fill-white"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatdemo;
