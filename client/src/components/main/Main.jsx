import { useEffect, useState } from 'react';

import "./main.scss"

import init from "./Init"

const Main = () => {
    const [initialised, setInitialised] = useState(false);

    useEffect(() => {
        !initialised ? init() : setInitialised(true)
    }, [initialised])

    return (
        <div className="main">
            <div className="game-container">
                <canvas className="game-canvas" width="960" height="540">
                </canvas>
            </div>
        </div>
    );
}

export default Main;