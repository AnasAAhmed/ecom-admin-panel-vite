import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const InternetStatus: React.FC = () => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const updateOnlineStatus = () => {
            setIsOnline(navigator.onLine);
        };

        updateOnlineStatus();

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
            console.log(isOnline ? 'online' : 'offline');

        };
    }, []);

    useEffect(() => {
        if (isOnline) {
            toast('You are Online.', {
                duration: Infinity,
            });
        } else {
            toast('You are offline. Please check your internet connection.', {
                duration: Infinity,
            });
        }
    }, [isOnline]);

    return null;
};

export default InternetStatus;
