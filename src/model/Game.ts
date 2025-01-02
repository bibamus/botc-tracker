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
    state: 'alive' | 'executed' | 'killed'
}

export interface Turn {
    number: number
    type: 'day' | 'night'
}

export interface Day extends Turn {
    type: 'day'
    nominations: Nomination[]
}


export interface Night extends Turn {
    type: 'night'
}

export interface Nomination {
    nominator: Player
    nominee: Player
    votes: Player[]
    ended: boolean
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
        nominations: []
    }]
}
