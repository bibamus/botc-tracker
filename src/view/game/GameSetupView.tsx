import {Game} from "../../model/Game.ts";
import {Box, Button} from "@mui/material";
import {GameAction} from "./GameAction.ts";

const minPlayers = 5;

interface GameSetupViewProps {
    game: Game,
    dispatch: (action: GameAction) => void
}

function GameSetupView({game, dispatch}: GameSetupViewProps) {

    function startGame() {
        // check if at least min players
        if (game.players.length < minPlayers) {
            alert(`At least ${minPlayers} players are required to start the game`)
            return
        }
        // check if all players have names
        if (game.players.some(player => player.name === '')) {
            alert('All players must have names before starting the game')
            return
        }
        dispatch({type: 'startGame'})
    }

    return <>
        <h2>Game Setup</h2>
        <Button onClick={() => startGame()}>Start Game</Button>
        <Button onClick={() => dispatch({type: 'addPlayer'})}>Add Player</Button>
        <p>Players:</p>
        <Box>
            {game.players.map(player =>
                <Box key={player.number}>{player.number} - <input value={player.name} onChange={event => dispatch({
                    type: 'updatePlayerName',
                    playerNumber: player.number,
                    name: event.target.value
                })}/>
                    <Button
                        onClick={() => dispatch({type: 'removePlayer', playerNumber: player.number})}>Remove</Button>
                </Box>)
            }
        </Box>
    </>
}

export default GameSetupView