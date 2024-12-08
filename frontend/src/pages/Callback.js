import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
    const navigate = useNavigate();

    const getTokenFromURL = () => {
        try {
            return window.location.hash
                .substring(1)
                .split('&')
                .reduce((initial, item) => {
                    let parts = item.split('=');
                    initial[parts[0]] = decodeURIComponent(parts[1]);
                    return initial;
                }, {});
        } catch (error) {
            console.error('Error parsing URL hash:', error);
            return {};
        }
    };

    const saveUserToBackend = async (access_token) => {
        try {
            
            const response = await fetch("http://localhost:5050/api/save-user", {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', // Add headers for content type
                }, 
                body: JSON.stringify({ access_token }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Backend response:', data);
                navigate('/graph');
                
            } else {
                console.error('Error from backend:');
            }

            
        } catch (error) {
            console.error('Error saving user to backend:', error);
        }
    };

    useEffect(() => {
        console.log("This is what we get from the URL: ", getTokenFromURL());
        const _spotifyToken = getTokenFromURL().access_token;
        // window.location.hash = "";
        console.log("Spotify Token: ", _spotifyToken)

        if (_spotifyToken) {
            saveUserToBackend(_spotifyToken);
        } else {
            console.error('Access token not found in URL');
        }
    }, []);

    return <div>Processing login...</div>;
};

export default Callback;