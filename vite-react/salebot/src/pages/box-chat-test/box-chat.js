import { useEffect, useRef, useState } from 'react';
import ReactLoading from 'react-loading';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { SSE } from '../chat-app/sse';

const messageType = {
    user: 'user',
    assistant: 'assistant',
};

const BoxChat = ({ data, datasetIds }) => {
    const { chatid, id } = useParams();

    const resultRef = useRef(null);
    const inputRef = useRef();
    const chatRef = useRef();

    const [messageList, setMessageList] = useState([]);
    const [loader, setLoader] = useState(false);
    const [question, setQuestion] = useState('');
    const [isLoadingRes, setIsLoadingRes] = useState(false);
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
            inputRef.current.focus();
        }
    };

    const handleGetQuesiton = (value) => {
        setQuestion(value);
    };
    const idHistory = localStorage.getItem('w');

    const resStream = async () => {
        if (!question) return;
        setLoader(true);
        setIsLoadingRes(true);

        const newMessages = [
            ...messageList,
            {
                role: messageType.user,
                content: question,
            },
        ];
        setMessageList(newMessages);

        const convert = [...datasetIds];

        let requestsQuestion = {
            dataset_ids: convert,
            question: question,
            system_message: data?.system_prompt,
            conversation_id: 'id demo not save',
            bot_id: chatid,
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
                    if (text !== '\n') {
                        setMessageList([
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
                // resultRef.current = '';
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
                setMessageList([
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

    useEffect(() => {
        if (chatRef?.current) chatRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [messageList]);

    return (
        <div
            className="container max-w-5xl mx-auto border-l border-r rounded sm:border-none chat"
            style={{ paddingTop: '30px' }}
        >
            <div className="chat-history h-[500px] ">
                <ul className="m-b-0">
                    {messageList.map((item, index) => (
                        <div className="flex flex-col gap-5 px-4 pt-4 " key={index}>
                            {item?.role === 'assistant' ? (
                                <div className="flex justify-start">
                                    <div
                                        className="p-5 text-white w-fit rounded-xl text-[14px]"
                                        style={{
                                            backgroundColor: '#edf2f7',
                                            color: 'black',
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
                                <div className="flex justify-end">
                                    <div
                                        className="p-5 text-white w-fit rounded-xl text-[14px]"
                                        style={{
                                            backgroundColor: '#1a94da',
                                            color: '#fff',
                                            width: '88%',
                                            fontFamily: 'sans-serif',
                                        }}
                                    >
                                        {item.content}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {loader && <ReactLoading type="bubbles" color="gray" />}
                </ul>

                <div ref={chatRef} />
            </div>
            <div className="relative flex mt-6 mb-8">
                <input
                    type="text"
                    className="py-3 rounded-lg border border-slate-400 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Nội dung chat"
                    required
                    ref={inputRef}
                    onKeyUp={(e) => handleOnKeyUp(e)}
                    value={question}
                    onChange={(e) => handleGetQuesiton(e?.target.value)}
                />
                <div className="absolute flex items-center h-full right-1.5 ">
                    <span
                        className="flex items-center px-3.5 py-1.5 rounded-md bg-slate-200 send-btn cursor-pointer"
                        style={{
                            borderTopRightRadius: '0.5rem',
                            borderBottomRightRadius: '0.5rem',
                            opacity: isLoadingRes && 0.5,
                            cursor: isLoadingRes && 'no-drop',
                        }}
                        onClick={handleSubmit}
                    >
                        Gửi
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BoxChat;
