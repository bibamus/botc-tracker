// a blood on the clocktower game state
export interface Game {
    state: 'setup' | 'playing' | 'finished'
    players: Player[]
    phases: Phase[]
}


export  type Phase = Day | Night;

export interface Player {
    number: number
    name: string
}

export interface Turn {
    number: number
    type: 'day' | 'night'
}

export interface Day extends Turn {
    type: 'day'
    nominations: Nomination[]
    executions: Execution[]
}


export interface Night extends Turn {
    type: 'night'
    kills: Kill[]
}

export interface GameEvent {
    type: string
}

export interface Nomination extends GameEvent {
    type: 'nomination'
    nominator: number
    nominee: number
    votes: number[]
    ended: boolean
}

export interface Execution extends GameEvent {
    type: 'execution'
    player: number
}

export interface Kill extends GameEvent {
    type: 'kill'
    player: number
}

export function currentPhase(game: Game): Phase {
    return game.phases[game.phases.length - 1]
}


export const initialGame: Game = {
    state: 'setup',
    players: [],
    phases: [{
        number: 1,
        type: 'day',
        nominations: [],
        executions: []
    }]
}
