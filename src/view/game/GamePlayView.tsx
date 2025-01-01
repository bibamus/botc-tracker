import {Game, Nomination, Phase, Player} from "../../model/Game.ts";
import {Box, Button, Checkbox} from "@mui/material";
import {useEffect, useState} from "react";
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
        const turn = game.turns[currentTurn];
        if (turn?.day === null) {
            return null;
        }
        const activeNominations = turn.day.nominations.filter(nomination => !nomination.ended);
        return activeNominations.length > 0 ? activeNominations[0] : null;
    }

    function endDay() {
        dispatch({type: 'changePhase', phase: 'night'});
        setCurrentPhase('night');
    }

    function endVoting() {
        dispatch({type: 'endNomination', nomination: activeNomination()!});
    }

    function nominate(player: Player) {
        dispatch({
            type: 'addNomination',
            nominator: currentNominator!,
            nominee: player,
            turnNumber: game.turns[currentTurn].turnNumber
        });
        setCurrentNominator(null);
    }

    // @ts-ignore
    const [currentTurn, setCurrentTurn] = useState(0);
    const [currentPhase, setCurrentPhase] = useState<Phase>('day');

    useEffect(() => {
        setCurrentPhase(game.turns[currentTurn].phase);
    }, [currentTurn]);

    const [currentNominator, setCurrentNominator] = useState<Player | null>(null);

    return <>
        <h2>Game</h2>
        <p>Current Turn: {game.turns[currentTurn].turnNumber} - Current Phase: {currentPhase}</p>

        {currentPhase === 'day' && <Button onClick={() => endDay()}>End Day</Button>}
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
                {currentPhase === 'day' && player.state === 'alive' && currentNominator === null && activeNomination() === null &&
                    <Button onClick={() => setCurrentNominator(player)}>Start Nominate</Button>}
                {currentPhase === 'day' && player.state === 'alive' && currentNominator === player && activeNomination() === null &&
                    <Button
                        onClick={() => setCurrentNominator(null)}>Cancel Nomination</Button>}
                {currentPhase === 'day' && player.state === 'alive' && currentNominator !== null && currentNominator !== player && activeNomination() === null &&
                    <Button onClick={() => nominate(player)}>Nominate</Button>}
                {currentPhase === 'day' && player.state === 'alive' && activeNomination() !== null &&
                    <Checkbox checked={activeNomination()?.votes.includes(player)} onChange={event => {
                        if (event.target.checked) {
                            dispatch({type: 'addVote', player: player, nomination: activeNomination()!});
                        } else {
                            dispatch({type: 'removeVote', player: player, nomination: activeNomination()!});
                        }
                    }}/>}
            </Box>)}
        </Box>
    </>
}

export default GamePlayView