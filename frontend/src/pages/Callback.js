import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';

const Callback = () => {
    const navigate = useNavigate();
    const setGenreDurations = useAuthStore((state) => state.setGenreDurations);
    const setGenreMap = useAuthStore((state) => state.setGenreMap);

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

    const fetchGenreDurations = async (accessToken) => {
        try {
            const response = await fetch('http://localhost:5050/api/genre-durations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ access_token: accessToken }),
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched genre durations:', data);
                setGenreDurations(data);
                await sendToGenreMap(accessToken, data);
                navigate('/graph');
            } else {
                console.error('Error fetching genre durations:', await response.text());
            }
        } catch (error) {
            console.error('Error fetching genre durations:', error);
        }
    };

    const sendToGenreMap = async (accessToken, genreDurations) => {
        try {
            const response = await fetch('http://localhost:5050/api/genre-map', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    access_token: accessToken,
                    genre_durations: genreDurations,
                }),
            });

            if (response.ok) {
                console.log('Genre map successfully created');
                const blob = await response.blob();
                const fileURL = URL.createObjectURL(blob);
                setGenreMap(fileURL); // Store the file URL in Zustand
            } else {
                console.error('Error sending genre durations to genre map:', await response.text());
            }
        } catch (error) {
            console.error('Error sending genre durations to genre map:', error);
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
                //navigate('/graph');
                
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
            fetchGenreDurations(_spotifyToken);
        } else {
            console.error('Access token not found in URL');
        }
    }, []);

    return <div>Processing login...</div>;
};

export default Callback;