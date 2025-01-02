import {Nomination, Player} from "../../model/Game.ts";

interface BaseAction {
    type: string
}

export interface AddPlayerAction extends BaseAction {
    type: 'addPlayer'
}

export interface RemovePlayerAction extends BaseAction {
    type: 'removePlayer'
    playerNumber: number
}

export interface UpdatePlayerNameAction extends BaseAction {
    type: 'updatePlayerName'
    playerNumber: number
    name: string
}

export interface StartGameAction extends BaseAction {
    type: 'startGame'
}

export interface EndPhaseAction extends BaseAction {
    type: 'endPhase'
}

export interface AddNominationAction extends BaseAction {
    type: 'addNomination'
    nominator: Player
    nominee: Player
    phaseNumber: number
}

export interface EndNominationAction extends BaseAction {
    type: 'endNomination'
    nomination: Nomination
    phaseNumber: number
}

export interface AddVoteAction extends BaseAction {
    type: 'addVote'
    player: Player
    nomination: Nomination
    phaseNumber: number
}

export interface RemoveVoteAction extends BaseAction {
    type: 'removeVote'
    player: Player
    nomination: Nomination
    phaseNumber: number
}

export type GameAction =
    AddPlayerAction
    | RemovePlayerAction
    | UpdatePlayerNameAction
    | StartGameAction
    | AddNominationAction
    | EndNominationAction
    | AddVoteAction
    | RemoveVoteAction
    | EndPhaseAction;
