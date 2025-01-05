import { Button, Checkbox } from "@mui/material";
import { Game } from "../../model/Game";
import {PlayerWithState, usePlayerActions} from "../../hooks";

interface PlayerActionsProps {
    player: PlayerWithState;
    game: Game;
    selectedPhase: number;
    nominator: number | null;
    addVote: (player: number) => void;
    removeVote: (player: number) => void;
    setNominator: (nominator: number) => void;
    cancelNomination: () => void;
    nominate: (player: number) => void;
    execute: (player: number) => void;
    kill: (player: number) => void;
}

function PlayerActions({
                           player,
                           game,
                           selectedPhase,
                           nominator,
                           setNominator,
                           addVote,
                           removeVote,
                           cancelNomination,
                           nominate,
                           execute,
                           kill
                       }: PlayerActionsProps) {
    const currentPhase = game.phases[selectedPhase];
    const nomination = currentPhase.type === 'day'
        ? currentPhase.nominations.find(n => !n.ended)||null
        : null;

    const {
        canStartNomination,
        canBeNominated,
        canVote,
        canBeExecuted,
        canBeKilled
    } = usePlayerActions(currentPhase, player.state, nomination);

    return (
        <>
            {/* Nomination actions */}
            {canStartNomination && nominator === null && (
                <Button onClick={() => setNominator(player.number)}>
                    Start Nominate
                </Button>
            )}

            {canStartNomination && nominator === player.number && (
                <Button onClick={cancelNomination}>
                    Cancel Nomination
                </Button>
            )}

            {canBeNominated && nominator !== null && nominator !== player.number && (
                <Button onClick={() => nominate(player.number)}>
                    Nominate
                </Button>
            )}

            {/* Voting actions */}
            {canVote && nomination && (
                <Checkbox
                    checked={nomination.votes.includes(player.number)}
                    onChange={(event) => {
                        if (event.target.checked) {
                            addVote(player.number);
                        } else {
                            removeVote(player.number);
                        }
                    }}
                />
            )}

            {/* Execution/Kill actions */}
            {canBeExecuted && (
                <Button onClick={() => execute(player.number)}>
                    Execute
                </Button>
            )}

            {canBeKilled && (
                <Button onClick={() => kill(player.number)}>
                    Kill
                </Button>
            )}
        </>
    );
}

export default PlayerActions;