import {Nomination, Phase, Player} from "../../model/Game.ts";

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

export interface ChangePhaseAction extends BaseAction {
    type: 'changePhase'
    phase: Phase
}

export interface AddNominationAction extends BaseAction {
    type: 'addNomination'
    nominator: Player
    nominee: Player
    turnNumber: number
}

export interface EndNominationAction extends BaseAction {
    type: 'endNomination'
    nomination: Nomination
}

export interface AddVoteAction extends BaseAction {
    type: 'addVote'
    player: Player
    nomination: Nomination
}

export interface RemoveVoteAction extends BaseAction {
    type: 'removeVote'
    player: Player
    nomination: Nomination
}

export type GameAction =
    AddPlayerAction
    | RemovePlayerAction
    | UpdatePlayerNameAction
    | StartGameAction
    | ChangePhaseAction
    | AddNominationAction
    | EndNominationAction
    | AddVoteAction
    | RemoveVoteAction;
