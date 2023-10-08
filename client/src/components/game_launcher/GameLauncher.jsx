import { useState } from 'react';
import './game-launcher.scss'

const GameLauncher = () => {
    const [gameLauncher, setGameLauncher] = useState(true);

    setTimeout(() => {
        setGameLauncher(false);
    }, 200)

    return (
        <>
            {gameLauncher && (
                <div className="game-launcher">
                    <h1>Launcher</h1>
                </div>
            )}
        </>
    );
}
export default GameLauncher;
