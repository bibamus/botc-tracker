import { useState, useEffect } from 'react';
import {currentPhase, Game, Nomination, Phase, Player} from "./model/Game.ts";
import {GameAction} from "./model/GameAction.ts";

export interface PlayerWithState extends Player {
    state: 'alive' | 'executed' | 'killed'
}

// Hook for managing the active phase and phase selection
export function usePhaseManagement(game: Game, dispatch: (action: GameAction) => void) {
    const [selectedPhase, setSelectedPhase] = useState(0);

    const getSelectedPhase = () => game.phases[selectedPhase];
    const isCurrentPhase = () => getSelectedPhase() === currentPhase(game);

    const endPhase = () => {
        dispatch({ type: 'endPhase' });
    };

    return {
        selectedPhase,
        setSelectedPhase,
        getSelectedPhase,
        isCurrentPhase,
        endPhase
    };
}

// Hook for managing nominations and voting
export function useNominations(game: Game, dispatch: (action: GameAction) => void) {
    const [currentNominator, setCurrentNominator] = useState<number | null>(null);

    const activeNomination = (): Nomination | null => {
        const phase = currentPhase(game);
        if (phase.type !== 'day') {
            return null;
        }
        return phase.nominations.find(nomination => !nomination.ended) || null;
    };

    const neededVotes = (alivePlayers: number) => {
        return Math.ceil(alivePlayers / 2);
    };

    const nominate = (nominee: number) => {
        if (currentNominator === null) return;

        dispatch({
            type: 'addNomination',
            nominator: currentNominator,
            nominee,
            phase: currentPhase(game).number
        });
        setCurrentNominator(null);
    };

    const endVoting = () => {
        const nomination = activeNomination();
        if (!nomination) return;

        dispatch({
            type: 'endNomination',
            nomination,
            phase: currentPhase(game).number
        });
    };

    const addVote = (player: number) => {
        const nomination = activeNomination();
        if (!nomination) return;

        dispatch({
            type: 'addVote',
            player,
            nomination,
            phase: currentPhase(game).number
        });
    };

    const removeVote = (player: number) => {
        const nomination = activeNomination();
        if (!nomination) return;

        dispatch({
            type: 'removeVote',
            player,
            nomination,
            phase: currentPhase(game).number
        });
    };

    return {
        currentNominator,
        setCurrentNominator,
        activeNomination,
        neededVotes,
        nominate,
        endVoting,
        addVote,
        removeVote
    };
}

// Hook for managing player states
export function usePlayerStates(game: Game, selectedPhase: number) {
    const [players, setPlayers] = useState<PlayerWithState[]>([]);

    useEffect(() => {
        const updatedPlayers = game.players.map(player => ({...player, state: 'alive' as const}));

        game.phases.slice(0, selectedPhase + 1).forEach(phase => {
            if (phase.type === 'day') {
                phase.executions.forEach(execution => {
                    const player = updatedPlayers.find(p => p.number === execution.player) as PlayerWithState;
                    if (player) player.state = 'executed';
                });
            }
            if (phase.type === 'night') {
                phase.kills.forEach(kill => {
                    const player = updatedPlayers.find(p => p.number === kill.player) as PlayerWithState;
                    if (player) player.state = 'killed';
                });
            }
        });

        setPlayers(updatedPlayers);
    }, [game, selectedPhase]);

    const executePlayer = (player: number, phase: number, dispatch: (action: GameAction) => void) => {
        dispatch({
            type: 'execute',
            player,
            phase
        });
    };

    const killPlayer = (player: number, phase: number, dispatch: (action: GameAction) => void) => {
        dispatch({
            type: 'kill',
            player,
            phase
        });
    };

    return {
        players,
        executePlayer,
        killPlayer
    };
}

// Hook for managing player actions visibility
export function usePlayerActions(phase: Phase, playerState: 'alive' | 'executed' | 'killed', nomination: Nomination | null) {
    const canStartNomination = phase.type === 'day' &&
        playerState === 'alive' &&
        !nomination;

    const canBeNominated = phase.type === 'day' &&
        playerState === 'alive' &&
        !nomination;

    const canVote = phase.type === 'day' &&
        playerState === 'alive' &&
        nomination !== null;

    const canBeExecuted = phase.type === 'day' &&
        playerState === 'alive';

    const canBeKilled = phase.type === 'night' &&
        playerState === 'alive';

    return {
        canStartNomination,
        canBeNominated,
        canVote,
        canBeExecuted,
        canBeKilled
    };
}