import {currentPhase, Game, Nomination, Player} from "../../model/Game.ts";
import {Box, Button, Checkbox} from "@mui/material";
import {useState} from "react";
import {GameAction} from "./GameAction.ts";

interface GamePlayViewProps {
    game: Game,
    dispatch: (action: GameAction) => void
}


function GamePlayView({game, dispatch}: GamePlayViewProps) {

    function neededVotes() {
        return Math.ceil(game.players.filter(player => player.state === 'alive').length / 2);
    }

    function activeNomination(): Nomination | null {
        const phase = currentPhase(game);
        if (phase.type !== 'day') {
            return null;
        }
        return phase.nominations.find(nomination => !nomination.ended) || null;
    }

    function endDay() {
        console.log(currentPhase);
        dispatch({type: 'endPhase'});
    }

    function endVoting() {
        dispatch({type: 'endNomination', nomination: activeNomination()!, phaseNumber: currentPhase(game).number});
    }

    function nominate(player: Player) {
        dispatch({
            type: 'addNomination',
            nominator: currentNominator!,
            nominee: player,
            phaseNumber: currentPhase(game).number
        });
        setCurrentNominator(null);
    }




    const [currentNominator, setCurrentNominator] = useState<Player | null>(null);

    return <>
        <h2>Game</h2>
        <p>Current Turn: {currentPhase(game).number} - Current Phase: {currentPhase(game).type}</p>

        {currentPhase(game).type === 'day' && <Button onClick={() => endDay()}>End Day</Button>}
        <Box marginLeft={10} marginRight={10}>
            {activeNomination() !== null &&
                <>
                    <span>{activeNomination()?.votes.length} of needed {neededVotes()} votes</span>
                    <Button onClick={() => {
                        endVoting();
                    }}>End voting</Button>
                </>
            }
            {game.players.map(player => <Box key={player.number}>
                {player.number} - {player.name} - {player.state}
                {currentPhase(game).type === 'day' && player.state === 'alive' && currentNominator === null && activeNomination() === null &&
                    <Button onClick={() => setCurrentNominator(player)}>Start Nominate</Button>}
                {currentPhase(game).type === 'day' && player.state === 'alive' && currentNominator === player && activeNomination() === null &&
                    <Button
                        onClick={() => setCurrentNominator(null)}>Cancel Nomination</Button>}
                {currentPhase(game).type === 'day' && player.state === 'alive' && currentNominator !== null && currentNominator !== player && activeNomination() === null &&
                    <Button onClick={() => nominate(player)}>Nominate</Button>}
                {currentPhase(game).type === 'day' && player.state === 'alive' && activeNomination() !== null &&
                    <Checkbox checked={activeNomination()?.votes.includes(player)} onChange={event => {
                        if (event.target.checked) {
                            dispatch({
                                type: 'addVote',
                                player: player,
                                nomination: activeNomination()!,
                                phaseNumber: currentPhase(game).number
                            });
                        } else {
                            dispatch({
                                type: 'removeVote',
                                player: player,
                                nomination: activeNomination()!,
                                phaseNumber: currentPhase(game).number
                            });
                        }
                    }}/>}
            </Box>)}
        </Box>
    </>
}

export default GamePlayView