'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.usePdf = void 0;
var react_1 = require('react');
var pdfjs = require('pdfjs-dist');
function isFunction(value) {
    return typeof value === 'function';
}
var usePdf = function (_a) {
    var canvasRef = _a.canvasRef,
        file = _a.file,
        onDocumentLoadSuccess = _a.onDocumentLoadSuccess,
        onDocumentLoadFail = _a.onDocumentLoadFail,
        onPageLoadSuccess = _a.onPageLoadSuccess,
        onPageLoadFail = _a.onPageLoadFail,
        onPageRenderSuccess = _a.onPageRenderSuccess,
        onPageRenderFail = _a.onPageRenderFail,
        _b = _a.scale,
        scale = _b === void 0 ? 1 : _b,
        _c = _a.rotate,
        rotate = _c === void 0 ? 0 : _c,
        _d = _a.page,
        page = _d === void 0 ? 1 : _d,
        cMapUrl = _a.cMapUrl,
        cMapPacked = _a.cMapPacked,
        _e = _a.workerSrc,
        workerSrc =
            _e === void 0 ? '//cdnjs.cloudflare.com/ajax/libs/pdf.js/'.concat(pdfjs.version, '/pdf.worker.js') : _e,
        _f = _a.withCredentials,
        withCredentials = _f === void 0 ? false : _f;
    var _g = (0, react_1.useState)(),
        pdfDocument = _g[0],
        setPdfDocument = _g[1];
    var _h = (0, react_1.useState)(),
        pdfPage = _h[0],
        setPdfPage = _h[1];
    var renderTask = (0, react_1.useRef)(null);
    var onDocumentLoadSuccessRef = (0, react_1.useRef)(onDocumentLoadSuccess);
    var onDocumentLoadFailRef = (0, react_1.useRef)(onDocumentLoadFail);
    var onPageLoadSuccessRef = (0, react_1.useRef)(onPageLoadSuccess);
    var onPageLoadFailRef = (0, react_1.useRef)(onPageLoadFail);
    var onPageRenderSuccessRef = (0, react_1.useRef)(onPageRenderSuccess);
    var onPageRenderFailRef = (0, react_1.useRef)(onPageRenderFail);
    // assign callbacks to refs to avoid redrawing
    (0, react_1.useEffect)(
        function () {
            onDocumentLoadSuccessRef.current = onDocumentLoadSuccess;
        },
        [onDocumentLoadSuccess],
    );
    (0, react_1.useEffect)(
        function () {
            onDocumentLoadFailRef.current = onDocumentLoadFail;
        },
        [onDocumentLoadFail],
    );
    (0, react_1.useEffect)(
        function () {
            onPageLoadSuccessRef.current = onPageLoadSuccess;
        },
        [onPageLoadSuccess],
    );
    (0, react_1.useEffect)(
        function () {
            onPageLoadFailRef.current = onPageLoadFail;
        },
        [onPageLoadFail],
    );
    (0, react_1.useEffect)(
        function () {
            onPageRenderSuccessRef.current = onPageRenderSuccess;
        },
        [onPageRenderSuccess],
    );
    (0, react_1.useEffect)(
        function () {
            onPageRenderFailRef.current = onPageRenderFail;
        },
        [onPageRenderFail],
    );
    (0, react_1.useEffect)(
        function () {
            pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
        },
        [workerSrc],
    );
    (0, react_1.useEffect)(
        function () {
            var config = { url: file, withCredentials: withCredentials };
            if (cMapUrl) {
                config.cMapUrl = cMapUrl;
                config.cMapPacked = cMapPacked;
            }
            pdfjs.getDocument(config).promise.then(
                function (loadedPdfDocument) {
                    setPdfDocument(loadedPdfDocument);
                    if (isFunction(onDocumentLoadSuccessRef.current)) {
                        onDocumentLoadSuccessRef.current(loadedPdfDocument);
                    }
                },
                function () {
                    if (isFunction(onDocumentLoadFailRef.current)) {
                        onDocumentLoadFailRef.current();
                    }
                },
            );
        },
        [file, withCredentials, cMapUrl, cMapPacked],
    );
    (0, react_1.useEffect)(
        function () {
            // draw a page of the pdf
            var drawPDF = function (page) {
                // Because this page's rotation option overwrites pdf default rotation value,
                // calculating page rotation option value from pdf default and this component prop rotate.
                var rotation = rotate === 0 ? page.rotate : page.rotate + rotate;
                var dpRatio = window.devicePixelRatio;
                var adjustedScale = scale * dpRatio;
                var viewport = page.getViewport({ scale: adjustedScale, rotation: rotation });
                var canvasEl = canvasRef.current;
                if (!canvasEl) {
                    return;
                }
                var canvasContext = canvasEl.getContext('2d');
                if (!canvasContext) {
                    return;
                }
                canvasEl.style.width = ''.concat(viewport.width / dpRatio, 'px');
                canvasEl.style.height = ''.concat(viewport.height / dpRatio, 'px');
                canvasEl.height = viewport.height;
                canvasEl.width = viewport.width;
                // if previous render isn't done yet, we cancel it
                if (renderTask.current) {
                    renderTask.current.cancel();
                    return;
                }
                renderTask.current = page.render({
                    canvasContext: canvasContext,
                    viewport: viewport,
                });
                return renderTask.current.promise.then(
                    function () {
                        renderTask.current = null;
                        if (isFunction(onPageRenderSuccessRef.current)) {
                            onPageRenderSuccessRef.current(page);
                        }
                    },
                    function (reason) {
                        renderTask.current = null;
                        if (reason && reason.name === 'RenderingCancelledException') {
                            drawPDF(page);
                        } else if (isFunction(onPageRenderFailRef.current)) {
                            onPageRenderFailRef.current();
                        }
                    },
                );
            };
            if (pdfDocument) {
                pdfDocument.getPage(page).then(
                    function (loadedPdfPage) {
                        setPdfPage(loadedPdfPage);
                        if (isFunction(onPageLoadSuccessRef.current)) {
                            onPageLoadSuccessRef.current(loadedPdfPage);
                        }
                        drawPDF(loadedPdfPage);
                    },
                    function () {
                        if (isFunction(onPageLoadFailRef.current)) {
                            onPageLoadFailRef.current();
                        }
                    },
                );
            }
        },
        [canvasRef, page, pdfDocument, rotate, scale],
    );
    return { pdfDocument: pdfDocument, pdfPage: pdfPage };
};
exports.usePdf = usePdf;
