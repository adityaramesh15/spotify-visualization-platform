import React from 'react';
import {loginUrl} from './spotify'
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div `
    background-color: #e97451; 
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 2fr; // Two equal-width columns
    gap: 200px; // Adjust spacing between columns as needed

    @media (max-width: 768px) {
        grid-template-columns: 1fr; // Single column on smaller screens
    }
`;

const MainContainer = styled.div`
    padding: 60px;

`;

const TitleContainer = styled.div`
    padding: 15px 32px;
    text-align: center;
    font-size: 128px;
    font-weight: bold;
    text-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;

const ButtonContainer = styled.div`
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const LoginButton = styled.button`
    background-color: #1DB954;
    border: none;
    padding: 15px 32px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 32px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
`;


const GraphicContainer = styled.div ``;






const Login = () => {
    const handleLogin = () => {
        window.location.href = 'http://localhost:5050/login';
    };  
    return (
        <PageContainer>
            <MainContainer>
                <TitleContainer>Mapify</TitleContainer>
                <ButtonContainer>
                    <LoginButton onClick={handleLogin}>Login with Spotify</LoginButton>
                </ButtonContainer>
            </MainContainer>

            <GraphicContainer>THREE.JS MAGIC HERE</GraphicContainer>

        </PageContainer>
    );
};

export default Login;