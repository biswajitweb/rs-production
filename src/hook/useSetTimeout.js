import { useEffect, useRef } from "react";


export default function useSetTimeout(callback, delay) {
    const callbackRef = useRef(callback);

    // Always keep the latest callback
    useEffect(()=>{
        callbackRef.current = callback;
    }, [callback]);

    useEffect(()=>{
        if (delay === null || delay === undefined) {
            return;
        }

        const timerId = setTimeout(() => {
                callbackRef.current();
            }, delay
        );

        // Cleanup timeout
        return () => {
            clearTimeout(timerId);
        };
    }, [delay]);
}