import React from 'react';
import Spin from '../../assets/images/loading.svg';
const Loading = () => {
    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <img src={Spin} alt="spin" />
        </div>
    );
};

export default Loading;
