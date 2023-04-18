import React, { useState } from 'react';
import pdf from '../../assets/images/SaleBot_Introduction.pdf';
import { usePdfRact } from '../../components/pdf';
import MyPdfViewer from './silderPdf';
// Create styles

const Home = () => {
    return (
        <div className="mb-14">
            <div className="max-w-6xl container mx-auto sm:px-4 sm:min-h-[72vh] min-h-[78vh] lg:px-4 xl:px-2">
                <MyPdfViewer />
            </div>
        </div>
    );
};

export default Home;
