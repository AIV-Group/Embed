import { Store } from 'react-notifications-component';

export const Notification = (title, messages, type) => {
    const notification = {
        title: title,
        message: messages,
        type: type,
        insert: 'top',
        container: 'top-right',
        animationIn: ['animate__animated', 'animate__fadeIn'],
        animationOut: ['animate__animated', 'animate__fadeOut'],
        dismiss: {
            duration: 3000,
            onScreen: true,
        },
    };
    Store.addNotification({ ...notification });
};
