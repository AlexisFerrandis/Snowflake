import { useState } from 'react'

import "./app.scss"

import Main from "./components/main/Main";
import GameLauncher from "./components/game_launcher/GameLauncher"

function App() {
    const [main, setMain] = useState(false);
    const [launcher, setLauncher] = useState(false)
    const [title, setTitle] = useState(true)

    const startGame = () => {
        setLauncher(true)
        setTitle(false)
        setTimeout(() => {
            setMain(true)
        }, 100)
    }

    return (
        <div className='app' id="app">
            {title && <h2 onClick={startGame}>Start</h2>}
            {launcher && <GameLauncher />}
            {main && <Main />}
        </div>
    )
}

export default App
