import React, { useEffect, useRef } from 'react';
import { BsSend } from 'react-icons/bs';

const InputChat = ({ question, handleSubmit, handleOnKeyUp, getValue, css, isLoadingRes, ...setting }) => {
    const inputRef = useRef();
    useEffect(() => {
        if (!isLoadingRes) inputRef.current.focus();
    }, [isLoadingRes]);
    return (
        <div className="flex items-center w-full rounded-b-xl" style={{ position: '' }}>
            <input
                onKeyUp={(e) => handleOnKeyUp(e)}
                className={`relative w-full px-5 bg-gray-200 m-4 rounded-3xl py-3 ${css ? css : ''}`}
                placeholder={setting?.placeholder}
                onChange={(e) => getValue(e?.target.value)}
                ref={inputRef}
                value={question}
            />
            <div className="" style={{ position: 'absolute', right: '10px' }}>
                <button className="px-6 py-2" onClick={() => handleSubmit()}>
                    <BsSend size="25" fill={isLoadingRes ? 'darkgrey' : ''} cursor={isLoadingRes ? 'no-drop' : ''} />
                </button>
            </div>
        </div>
    );
};

export default InputChat;
