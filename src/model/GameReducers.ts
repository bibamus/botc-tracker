import {currentPhase, Game} from "./Game.ts";
import {
    AddNominationAction,
    AddVoteAction,
    EndNominationAction, ExecuteAction,
    GameAction, KillAction,
    RemoveVoteAction,
    UpdatePlayerNameAction
} from "./GameAction.ts";


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
        players: [...state.players, {name: '', number: state.players.length + 1}]
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


function addNomination(state: Game, action: AddNominationAction) {
    return {
        ...state,
        phases: state.phases
            .map(phase => phase.number === action.phase && phase.type === 'day' ? {
                ...phase,
                nominations: [...phase.nominations, {
                    type: 'nomination',
                    nominator: action.nominator,
                    nominee: action.nominee,
                    votes: [],
                    ended: false
                }]
            } : phase)
    } satisfies Game;
}

function endNomination(state: Game, action: EndNominationAction) {
    return {
        ...state,
        phases: state.phases
            .map(phase => phase.number === action.phase && phase.type === 'day' ? {
                ...phase,
                nominations: phase.nominations.map(nomination => nomination === action.nomination ? {
                    ...nomination,
                    ended: true
                } : nomination)
            } : phase)
    }


}

function addVote(state: Game, action: AddVoteAction) {
    return {
        ...state,
        phases: state.phases
            .map(phase => phase.number === action.phase && phase.type === 'day' ? {
                ...phase,
                nominations: phase.nominations.map(nomination => nomination === action.nomination ? {
                    ...nomination,
                    votes: [...nomination.votes, action.player]
                } : nomination)
            } : phase)
    }

}

function removeVote(state: Game, action: RemoveVoteAction) {
    return {
        ...state,
        phases: state.phases
            .map(phase => phase.number === action.phase && phase.type === 'day' ? {
                ...phase,
                nominations: phase.nominations.map(nomination => nomination === action.nomination ? {
                    ...nomination,
                    votes: nomination.votes.filter(player => player !== action.player)
                } : nomination)
            } : phase)
    }

}

function endPhase(state: Game) {
    const current = currentPhase(state);
    if (current.type === 'day') {
        return {
            ...state,
            phases: [...state.phases, {
                number: current.number,
                type: 'night',
                kills: []
            }]
        } satisfies Game;
    }
    if (current.type === 'night') {
        return {
            ...state,
            phases: [...state.phases, {
                number: current.number + 1,
                type: 'day',
                nominations: [],
                executions: [],
            }]
        } satisfies Game;
    }
    return state;
}

function execute(state: Game, action: ExecuteAction) {
    return {
        ...state,
        phases: state.phases.map((phase, index) => index === action.phase && phase.type === 'day' ? {
            ...phase,
            executions: [...phase.executions, {
                type: 'execution',
                player: action.player
            }]
        } : phase)
    } satisfies Game;
}

function kill(state: Game, action: KillAction) {
    return {
        ...state,
        phases: state.phases.map((phase, index) => index === action.phase && phase.type === 'night' ? {
            ...phase,
            kills: [...phase.kills, {
                type: 'kill',
                player: action.player
            }]
        } : phase)
    } satisfies Game;

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
        case 'addNomination':
            return addNomination(state, action);
        case 'endNomination':
            return endNomination(state, action);
        case 'addVote':
            return addVote(state, action);
        case 'removeVote':
            return removeVote(state, action);
        case 'endPhase':
            return endPhase(state);
        case 'execute':
            return execute(state, action);
        case 'kill':
            return kill(state, action);
        default:
            return state;
    }
}