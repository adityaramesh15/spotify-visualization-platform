import React from 'react';
import {loginUrl} from './spotify'
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
`;

const LoginButton = styled.button`
    background-color: #1DB954;
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
    border-radius: 32px;
`;

const Login = () => {
    return (
        <ButtonContainer>
            <Link to="/graph">
                <LoginButton>Login to Spotify</LoginButton>
            </Link>
        </ButtonContainer>
    );
};

export default Login;