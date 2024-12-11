import React from "react";
import { createContex, useContext, useState } from React;

const MutatorContext = createContex({});

export const TextureProvider = (props) => {
    const [texture, setTexture] = useState("2months");
    return (
        <MutatorContext.Provider value={{ texture, setTexture }}>
            {props.children}
        </MutatorContext.Provider>
    );
};

export const useMutator = () => {
    const context = useContext(MutatorContext);
    return context;
};