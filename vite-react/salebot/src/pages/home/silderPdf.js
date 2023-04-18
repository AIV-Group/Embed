import React, { useState, useRef } from 'react';
import { usePdf } from '../../components/pdf';
import pdf from '../../assets/images/GPT SaleBot_Introduction_v1.0.pdf';
import Loading from '../../components/loading';
import { MdOutlineNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';

const MyPdfViewer = () => {
    const [page, setPage] = useState(1);
    const canvasRef = useRef(null);

    const { pdfDocument, pdfPage } = usePdf({
        file: pdf,
        page,
        canvasRef,
    });
    return (
        <div className="mt-12 mx-auto homepage-style">
            {!pdfDocument && <Loading />}
            <canvas className="shadow canvas" style={{ margin: 'auto' }} ref={canvasRef} />
            {Boolean(pdfDocument && pdfDocument.numPages) && (
                <nav className="mx-auto flex justify-center mt-4">
                    <ul className="pager flex flex-wrap gap-5">
                        <li className="previous">
                            <button
                                className="border rounded px-5 py-2 shadow"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                <GrFormPrevious />
                            </button>
                        </li>
                        <li className="next flex items-center">
                            <button
                                className="border rounded px-5 py-2  shadow"
                                disabled={page === pdfDocument.numPages}
                                onClick={() => setPage(page + 1)}
                            >
                                <MdOutlineNavigateNext />
                            </button>
                        </li>
                    </ul>
                </nav>
            )}
        </div>
    );
};
export default MyPdfViewer;
