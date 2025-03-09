import { useEffect, useState } from "react";

const NoInternetAlert = () => {
    const [isOffline, setIsOffline] = useState(!navigator.onLine);

    useEffect(() => {
        const handleOffline = () => {
            setIsOffline(true);
            alert("No internet connection. Please check your network.");
        };

        const handleOnline = () => {
            setIsOffline(false);
        };

        window.addEventListener("offline", handleOffline);
        window.addEventListener("online", handleOnline);

        return () => {
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("online", handleOnline);
        };
    }, []);

    return isOffline ? (
        <div className="fixed top-0 left-0 w-full bg-red-500 text-white text-center p-2">
            No internet connection
        </div>
    ) : null;
};

export default NoInternetAlert;
