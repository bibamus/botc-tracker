import {currentPhase, Game, Nomination, Player} from "../../model/Game.ts";
import {Box, Button, Checkbox, List, ListItem} from "@mui/material";
import {useEffect, useState} from "react";
import {GameAction} from "../../model/GameAction.ts";

interface GamePlayViewProps {
    game: Game,
    dispatch: (action: GameAction) => void
}

interface PlayerWithState extends Player {
    state: 'alive' | 'executed' | 'killed'
}

function GamePlayView({game, dispatch}: GamePlayViewProps) {


    const [currentNominator, setCurrentNominator] = useState<number | null>(null);
    const [players, setPlayers] = useState<PlayerWithState[]>([]);
    const [selectedPhase, setSelectedPhase] = useState(0);

    function neededVotes() {
        return Math.ceil(players.filter(player => player.state === 'alive').length / 2);
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
            nominee: player.number,
            phaseNumber: currentPhase(game).number
        });
        setCurrentNominator(null);
    }



    function getSelectedPhase() {
        return game.phases[selectedPhase];
    }




    useEffect(() => {
        const players = game.players.map(player => ({...player, state: 'alive'})) as PlayerWithState[];
        game.phases.forEach(phase => {
            if (phase.type === 'day') {
                phase.executions.forEach(execution => {
                    players.find(player => player.number === execution.player.number)!.state = 'executed';
                })
            }
            if (phase.type === 'night') {
                phase.kills.forEach(kill => {
                    players.find(player => player.number === kill.player.number)!.state = 'killed';
                });
            }
        });
        setPlayers(players);
    }, [game]);

    return <Box display={"flex"}>
        <Box border={1} marginRight={5} paddingRight={2} paddingLeft={2}>
            <h2>Phases</h2>
            <List>
                {game.phases.map((phase, index) => <ListItem key={index} onClick={() => setSelectedPhase(index)}>
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
                {players.map(player => <Box key={player.number}>
                    {player.number} - {player.name} - {player.state}
                    {getSelectedPhase().type === 'day' && player.state === 'alive' && currentNominator === null && activeNomination() === null &&
                        <Button onClick={() => setCurrentNominator(player.number)}>Start Nominate</Button>}
                    {getSelectedPhase().type === 'day' && player.state === 'alive' && currentNominator === player.number && activeNomination() === null &&
                        <Button
                            onClick={() => setCurrentNominator(null)}>Cancel Nomination</Button>}
                    {getSelectedPhase().type === 'day' && player.state === 'alive' && currentNominator !== null && currentNominator !== player.number && activeNomination() === null &&
                        <Button onClick={() => nominate(player)}>Nominate</Button>}
                    {getSelectedPhase().type === 'day' && player.state === 'alive' && activeNomination() !== null &&
                        <Checkbox checked={activeNomination()?.votes.includes(player.number)} onChange={event => {
                            if (event.target.checked) {
                                dispatch({
                                    type: 'addVote',
                                    player: player.number,
                                    nomination: activeNomination()!,
                                    phaseNumber: getSelectedPhase().number
                                });
                            } else {
                                dispatch({
                                    type: 'removeVote',
                                    player: player.number,
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