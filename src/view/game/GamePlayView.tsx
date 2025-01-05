import { Box, Button, List, ListItem } from "@mui/material";
import { Game } from "../../model/Game";
import { GameAction } from "../../model/GameAction";
import PlayerActions from "./PlayerActions";
import {
    usePhaseManagement,
    useNominations,
    usePlayerStates
} from "../../hooks";

interface GamePlayViewProps {
    game: Game;
    dispatch: (action: GameAction) => void;
}

function GamePlayView({ game, dispatch }: GamePlayViewProps) {
    const {
        selectedPhase,
        setSelectedPhase,
        getSelectedPhase,
        isCurrentPhase,
        endPhase
    } = usePhaseManagement(game, dispatch);

    const {
        currentNominator,
        setCurrentNominator,
        activeNomination,
        neededVotes,
        nominate,
        endVoting,
        addVote,
        removeVote
    } = useNominations(game, dispatch);

    const {
        players,
        executePlayer,
        killPlayer
    } = usePlayerStates(game, selectedPhase);

    return (
        <Box display="flex">
            <Box border={1} marginRight={5} paddingRight={2} paddingLeft={2}>
                <h2>Phases</h2>
                <List>
                    {game.phases.map((phase, index) => (
                        <ListItem
                            key={index}
                            onClick={() => setSelectedPhase(index)}
                        >
                            {phase.type} {phase.number}
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Box>
                <h2>Game</h2>
                <p>{getSelectedPhase().type} {getSelectedPhase().number}</p>

                {isCurrentPhase() && (
                    <Button onClick={endPhase}>
                        End {getSelectedPhase().type === 'day' ? 'Day' : 'Night'}
                    </Button>
                )}

                <Box marginLeft={10} marginRight={10}>
                    {activeNomination() && (
                        <>
                            <span>
                                {activeNomination()?.votes.length} of needed {neededVotes(players.filter(p => p.state === 'alive').length)} votes
                            </span>
                            <Button onClick={endVoting}>End voting</Button>
                        </>
                    )}

                    {players.map(player => (
                        <Box key={player.number}>
                            {player.number} - {player.name} - {player.state}
                            <PlayerActions
                                player={player}
                                game={game}
                                selectedPhase={selectedPhase}
                                nominator={currentNominator}
                                addVote={addVote}
                                removeVote={removeVote}
                                setNominator={setCurrentNominator}
                                cancelNomination={() => setCurrentNominator(null)}
                                nominate={nominate}
                                execute={(player) => executePlayer(player, selectedPhase, dispatch)}
                                kill={(player) => killPlayer(player, selectedPhase, dispatch)}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}

export default GamePlayView;