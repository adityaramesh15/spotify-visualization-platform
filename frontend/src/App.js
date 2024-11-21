import React from 'react';
import Login from './pages/Login';
import Graph from './pages/Graph';
import Callback from './pages/Callback'
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from "react-router-dom";
import './App.css';



const App = () => {
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/graph"
                    element={<Graph />}
                />
                <Route path="/callback" element={<Callback />} />
            </Routes>
        </Router>);
};

export default App;
