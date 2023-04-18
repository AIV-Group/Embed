import React, { useEffect, useRef, useState } from 'react';
import ReactLoading from 'react-loading';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { AxiosGetAPI } from '../../api';
import InputChat from '../../components/input';
import Loading from '../../components/loading';
import { SSE } from './sse';
const URL = process.env.REACT_APP_URL_CHAT;

const messageType = {
    user: 'user',
    assistant: 'assistant',
};
const ChatApp = () => {
    const [messages, setMessages] = useState([]);
    const [loader, setLoader] = useState(false);
    const { id } = useParams();
    const [question, setQuestion] = useState('');
    const chatRef = useRef();
    const [dataChat, setDataChat] = useState();
    const [loadingApp, setLoadingApp] = useState(false);
    const [checkSetW, setCheckSetW] = useState(true);
    const [isLoadingRes, setIsLoadingRes] = useState(false);

    const idHistory = localStorage.getItem('w');
    const [datasetIds, setDatasetIds] = useState();

    const handleGetQuesiton = (value) => {
        setQuestion(value);
    };
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
            bot_id: id,
            history_chat: newMessages,
        };

        let source = new SSE(`${process.env.REACT_APP_URL_CHAT}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            payload: JSON.stringify(requestsQuestion),
        });

        try {
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
        } catch (error) {
            setMessages([
                ...newMessages,
                {
                    role: messageType.assistant,
                    content: 'Xin lỗi không thể phục vụ vào lúc này',
                },
            ]);
        }
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
    }, [id]);

    const getStyleChatApp = async () => {
        setLoadingApp(true);
        try {
            const res = await AxiosGetAPI(`embed/bot/${id}`);
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
        if (chatRef?.current) chatRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return loadingApp ? (
        <div className="w-full h-full m-auto">
            <Loading />
        </div>
    ) : dataChat?.isPublic ? (
        <div
            className="w-full"
            style={{
                width: '100vw',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'white',
            }}
        >
            <div
                className="w-full p-5 "
                style={{
                    background: dataChat?.boxChat_backgroundColor,
                }}
            >
                <h3 className="text-xl font-bold text-white">
                    {dataChat?.boxChat_title ? dataChat?.boxChat_title : 'Heading'}
                </h3>
                <p className="text-white">{dataChat?.boxChat_subTitle ? dataChat?.boxChat_subTitle : 'sub heading'}</p>
            </div>

            <div className="w-full h-full p-5" style={{ overflowY: 'auto' }}>
                <ul className="flex" style={{ flexDirection: 'column' }}>
                    {messages?.map((item, idx) =>
                        item?.role === 'assistant' ? (
                            <li key={idx} className="flex flex-row my-2 text-[14px]">
                                <p
                                    style={{
                                        background: dataChat?.botM_backgroundColor,
                                        color: dataChat?.botM_color,
                                        width: '88%',
                                        fontFamily: 'sans-serif',
                                    }}
                                    className="px-3 py-2 rounded"
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
                                </p>
                            </li>
                        ) : (
                            <li key={idx} className="flex flex-row-reverse my-2 text-[14px]">
                                <p
                                    style={{
                                        background: dataChat?.userM_backgroundColor,
                                        color: dataChat?.userM_color,
                                        width: '88%',
                                        fontFamily: 'sans-serif',
                                    }}
                                    className="px-3 py-2 rounded"
                                >
                                    {item?.content}
                                </p>
                            </li>
                        ),
                    )}
                    {loader && <ReactLoading type="bubbles" color="gray" />}
                </ul>
                <div ref={chatRef} />
            </div>
            <div>
                <InputChat
                    handleOnKeyUp={handleOnKeyUp}
                    handleSubmit={handleSubmit}
                    placeholder="Nội dung chat"
                    getValue={handleGetQuesiton}
                    isLoadingRes={isLoadingRes}
                    question={question}
                />
            </div>
        </div>
    ) : (
        <div className="w-full h-full m-auto">
            <div className="flex justify-center mt-60">Đang bảo trì</div>
        </div>
    );
};

export default ChatApp;
