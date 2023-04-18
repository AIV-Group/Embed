import React from 'react';
import Modal from 'react-modal';
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const Popup = ({ isPopupOpen, setIsPopupOpen, children }) => {
    Modal.setAppElement('body');
    return (
        <Modal
            isOpen={isPopupOpen}
            onRequestClose={() => setIsPopupOpen(false)}
            style={customStyles}
            contentLabel="Example Modal"
        >
            {children}
        </Modal>
    );
};

export default Popup;
