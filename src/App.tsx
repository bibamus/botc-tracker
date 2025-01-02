import './App.css'
import GameView from "./view/game/GameView.tsx";
import {Box, CssBaseline} from "@mui/material";

function App() {

    return (
        <>
            <CssBaseline/>
            <Box minHeight={'100%'}>
                <h1>Blood on the Clocktower - Tracker</h1>
                <GameView/>
            </Box>
        </>
    )
}

export default App
