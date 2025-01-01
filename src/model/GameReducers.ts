import {Game} from "./Game.ts";
import {
    AddNominationAction, AddVoteAction,
    ChangePhaseAction,
    EndNominationAction, GameAction, RemoveVoteAction,
    UpdatePlayerNameAction
} from "../view/game/GameAction.ts";



// remove player and renumber the remaining players
function removePlayer(state: Game, playerNumber: number) {
    return {
        ...state,
        players: state.players.filter(player => player.number !== playerNumber)
            .map((player, index) => ({
                ...player,
                number: index + 1
            }))
    }
}

function addPlayer(state: Game) {
    return {
        ...state,
        players: [...state.players, {name: '', state: 'alive', number: state.players.length + 1}]
    } satisfies Game;
}

function updatePlayerName(state: Game, action: UpdatePlayerNameAction) {
    return {
        ...state,
        players: state.players.map(player => player.number === action.playerNumber ? {
            ...player,
            name: action.name
        } : player)
    }
}

function startGame(state: Game) {
    return {
        ...state,
        state: 'playing'
    } satisfies Game;
}

function changePhase(state: Game, action: ChangePhaseAction) {
    return {
        ...state,
        turns: state.turns.map(turn => ({
            ...turn,
            phase: action.phase
        }))
    }
}

function addNomination(state: Game, action: AddNominationAction) {
    return {
        ...state,
        turns: state.turns.map(turn => turn.turnNumber === action.turnNumber ? {
            ...turn,
            day: {
                nominations: [...turn.day!.nominations, {
                    nominator: action.nominator,
                    nominee: action.nominee,
                    votes: [],
                    ended: false
                }]
            }
        } : turn)
    }
}

function endNomination(state: Game, action: EndNominationAction) {
    return {
        ...state,
        turns: state.turns.map(turn => ({
            ...turn,
            day: {
                nominations: turn.day!.nominations.map(nomination => nomination === action.nomination ? {
                    ...nomination,
                    ended: true
                } : nomination)
            }
        }))
    } satisfies Game;
}

function addVote(state: Game, action: AddVoteAction) {
    return {
        ...state,
        turns: state.turns.map(turn => ({
            ...turn,
            day: {
                nominations: turn.day!.nominations.map(nomination => nomination === action.nomination ? {
                    ...nomination,
                    votes: [...nomination.votes, action.player]
                } : nomination)
            }
        }))
    }
}

function removeVote(state: Game, action: RemoveVoteAction) {
    return {
        ...state,
        turns: state.turns.map(turn => ({
            ...turn,
            day: {
                nominations: turn.day!.nominations.map(nomination => nomination === action.nomination ? {
                    ...nomination,
                    votes: nomination.votes.filter(player => player !== action.player)
                } : nomination)
            }
        }))
    }
}

export default function gameReducer(state: Game, action: GameAction): Game {
    switch (action.type) {
        case 'addPlayer':
            return addPlayer(state);
        case 'removePlayer':
            return removePlayer(state, action.playerNumber);
        case 'updatePlayerName':
            return updatePlayerName(state, action);
        case 'startGame':
            return startGame(state);
        case 'changePhase':
            return changePhase(state, action);
        case 'addNomination':
            return addNomination(state, action);
        case 'endNomination':
            return endNomination(state, action);
        case 'addVote':
            return addVote(state, action);
        case 'removeVote':
            return removeVote(state, action);
        default:
            return state;
    }
}