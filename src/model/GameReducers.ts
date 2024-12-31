import {Game} from "./Game.ts";

interface BaseAction {
    type: string
}

interface AddPlayerAction extends BaseAction {
    type: 'addPlayer'
}

interface RemovePlayerAction extends BaseAction {
    type: 'removePlayer'
    playerNumber: number
}

interface UpdatePlayerNameAction extends BaseAction {
    type: 'updatePlayerName'
    playerNumber: number
    name: string
}

interface StartGameAction extends BaseAction {
    type: 'startGame'
}

export type GameAction = AddPlayerAction | RemovePlayerAction | UpdatePlayerNameAction | StartGameAction;


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

export default function gameReducer(state: Game, action: GameAction): Game {
    switch (action.type) {
        case 'addPlayer':
            return {
                ...state,
                players: [...state.players, {name: '', state: 'alive', number: state.players.length + 1}]
            };
        case 'removePlayer':
            return removePlayer(state, action.playerNumber);
        case 'updatePlayerName':
            return {
                ...state,
                players: state.players.map(player => player.number === action.playerNumber ? {
                    ...player,
                    name: action.name
                } : player)
            }
        case 'startGame':
            return {
                ...state,
                state: 'playing'
            }
        default:
            return state;
    }
}