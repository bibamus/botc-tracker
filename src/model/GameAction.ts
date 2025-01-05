import {Nomination} from "./Game.ts";

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
    nominator: number
    nominee: number
    phase: number
}

export interface EndNominationAction extends BaseAction {
    type: 'endNomination'
    nomination: Nomination
    phase: number
}

export interface AddVoteAction extends BaseAction {
    type: 'addVote'
    player: number
    nomination: Nomination
    phase: number
}

export interface RemoveVoteAction extends BaseAction {
    type: 'removeVote'
    player: number
    nomination: Nomination
    phase: number
}

export interface ExecuteAction extends BaseAction {
    type: 'execute'
    player: number,
    phase: number
}

export interface KillAction extends BaseAction {
    type: 'kill'
    player: number
    phase: number
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
    | EndPhaseAction
    | ExecuteAction
    | KillAction;
