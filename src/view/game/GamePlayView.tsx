import {Game, Phase, Player, Turn} from "../../model/Game.ts";
import {GameAction} from "../../model/GameReducers.ts";
import {Box, Button, Checkbox} from "@mui/material";
import {useState} from "react";

interface GamePlayViewProps {
    game: Game,
    dispatch: (action: GameAction) => void
}


// @ts-ignore
function GamePlayView({game, dispatch}: GamePlayViewProps) {

    function neededVotes() {
        return Math.ceil(game.players.filter(player => player.state === 'alive').length / 2);
    }

    // @ts-ignore
    const [currentTurn, setCurrentTurn] = useState<Turn>({
        turnNumber: 1,
        day: {
            nominations: []
        },
        night: null
    });
    // @ts-ignore
    const [currentPhase, setCurrentPhase] = useState<Phase>('day');

    const [currentNominator, setCurrentNominator] = useState<Player | null>(null);
    const [currentNominee, setCurrentNominee] = useState<Player | null>(null);
    const [currentVotes, setCurrentVotes] = useState<Player[]>([]);

    return <>
        <h2>Game</h2>
        <p>Current Turn: {currentTurn.turnNumber} - Current Phase: {currentPhase}</p>

        <Box margin={10}>
            {currentNominator !== null && currentNominee !== null && <p>{currentVotes.length} of needed {neededVotes()}</p>}
            {currentNominator !== null && currentNominee !== null && <Button onClick={() => {
                setCurrentNominator(null);
                setCurrentNominee(null);
            }}>End voting</Button>}
            {game.players.map(player => <Box key={player.number}>
                {player.number} - {player.name} - {player.state}
                {currentPhase === 'day' && player.state === 'alive' && currentNominator === null && currentNominee === null &&
                    <Button onClick={() => setCurrentNominator(player)}>Start Nominate</Button>}
                {currentPhase === 'day' && player.state === 'alive' && currentNominator === player && currentNominee === null &&
                    <Button
                        onClick={() => setCurrentNominator(null)}>Cancel Nomination</Button>}
                {currentPhase === 'day' && player.state === 'alive' && currentNominator !== null && currentNominator !== player && currentNominee === null &&
                    <Button onClick={() => setCurrentNominee(player)}>Nominate</Button>}
                {currentPhase === 'day' && player.state === 'alive' && currentNominator !== null && currentNominee !== null &&
                    <Checkbox checked={currentVotes.includes(player)} onChange={event => {
                        if (event.target.checked) {
                            setCurrentVotes([...currentVotes, player])
                        } else {
                            setCurrentVotes(currentVotes.filter(voter => voter !== player))
                        }
                    }}/>}
            </Box>)}
        </Box>
    </>
}

export default GamePlayView