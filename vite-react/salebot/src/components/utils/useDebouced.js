import { useState, useEffect } from 'react';

export default function useDeboundced(value, delay) {
    const [useDeboundced, setUseDeboundced] = useState(value);
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setUseDeboundced(value);
        }, delay);
        return () => clearTimeout(timeoutId);
    }, [value]);
    return useDeboundced;
}
