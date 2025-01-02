import {currentPhase, Game, Nomination, Player} from "../../model/Game.ts";
import {Box, Button, Checkbox, List, ListItem} from "@mui/material";
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

    function endPhase() {
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

    const [selectedPhase, setSelectedPhase] = useState({
        number: 1,
        type: 'day'
    });

    function getSelectedPhase() {
        return game.phases.find(phase => phase.number === selectedPhase.number && phase.type === selectedPhase.type)!;
    }


    const [currentNominator, setCurrentNominator] = useState<Player | null>(null);

    return <Box display={"flex"}>
        <Box border={1} marginRight={5} paddingRight={2} paddingLeft={2}>
            <h2>Phases</h2>
            <List>
                {game.phases.map(phase => <ListItem key={phase.number} onClick={() => setSelectedPhase({
                    number: phase.number,
                    type: phase.type
                })}>
                    {phase.type} {phase.number}
                </ListItem>)}
            </List>
        </Box>
        <Box>
            <h2>Game</h2>
            <p>{getSelectedPhase().type} {getSelectedPhase().number}</p>
            {getSelectedPhase() === currentPhase(game) && currentPhase(game).type === 'day' &&
                <Button onClick={() => endPhase()}>End Day</Button>}
            {getSelectedPhase() === currentPhase(game) && currentPhase(game).type === 'night' &&
                <Button onClick={() => endPhase()}>End Night</Button>}
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
                    {getSelectedPhase().type === 'day' && player.state === 'alive' && currentNominator === null && activeNomination() === null &&
                        <Button onClick={() => setCurrentNominator(player)}>Start Nominate</Button>}
                    {getSelectedPhase().type === 'day' && player.state === 'alive' && currentNominator === player && activeNomination() === null &&
                        <Button
                            onClick={() => setCurrentNominator(null)}>Cancel Nomination</Button>}
                    {getSelectedPhase().type === 'day' && player.state === 'alive' && currentNominator !== null && currentNominator !== player && activeNomination() === null &&
                        <Button onClick={() => nominate(player)}>Nominate</Button>}
                    {getSelectedPhase().type === 'day' && player.state === 'alive' && activeNomination() !== null &&
                        <Checkbox checked={activeNomination()?.votes.includes(player)} onChange={event => {
                            if (event.target.checked) {
                                dispatch({
                                    type: 'addVote',
                                    player: player,
                                    nomination: activeNomination()!,
                                    phaseNumber: getSelectedPhase().number
                                });
                            } else {
                                dispatch({
                                    type: 'removeVote',
                                    player: player,
                                    nomination: activeNomination()!,
                                    phaseNumber: getSelectedPhase().number
                                });
                            }
                        }}/>}
                </Box>)}
            </Box>
        </Box>
    </Box>
}

export default GamePlayView