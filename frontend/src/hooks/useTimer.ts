import { useState, useRef, useEffect } from "react"
export interface useTimerInterface {
    timeLeft: number;
    isRunning: boolean;
    start: () => void;
    stop: () => void;
    restart: () => void;
}
const useTimer = (initialTime: number = 15): useTimerInterface => {
    const [timeLeft, setTimeLeft] = useState<number>(initialTime);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const intervalRef = useRef<number | null>(null);
    useEffect(() => {
        if (!isRunning) return;
        intervalRef.current = window.setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsRunning(false);
                    if (intervalRef.current !== null)
                        clearInterval(intervalRef.current);
                    return 0;
                }
                return prev - 1;
            })
        }, 1000);
        return () => {
            if (intervalRef.current !== null) clearInterval(intervalRef.current);
        }
    }, [isRunning]);
    const start = () => setIsRunning(true);
    const stop = () => setIsRunning(false);
    const restart = () => {
        if (intervalRef.current !== null) clearInterval(intervalRef.current);
        setTimeLeft(initialTime);
        setIsRunning(true);
    }
    return { timeLeft, isRunning, start, stop, restart };
};

export default useTimer;

