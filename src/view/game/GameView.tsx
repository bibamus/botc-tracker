import gameReducer from "../../model/GameReducers.ts";
import {initialGame} from "../../model/Game.ts";
import {useReducer} from "react";
import {Box} from "@mui/material";
import GameSetupView from "./GameSetupView.tsx";
import GamePlayView from "./GamePlayView.tsx";





function GameView() {

    const [game, dispatch] = useReducer(gameReducer, initialGame);

    return (
        <Box sx={{marginTop: 0}} minHeight={'100%'}>
            {game.state === 'setup' && <GameSetupView game={game} dispatch={dispatch}/>}
            {game.state === 'playing' && <GamePlayView game={game} dispatch={dispatch}/>}
        </Box>
    )
}

export default GameView