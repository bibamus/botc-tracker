// a blood on the clocktower game state
export interface Game {
    state: 'setup' | 'playing' | 'finished'
    players: Player[]
    turns: Turn[]
}

export const initialGame: Game = {
    state: 'setup',
    players: [],
    turns: [
        {
            turnNumber: 1,
            phase: 'day',
            day: {
                nominations: []
            },
            night: null
        }
    ]
}

export  type Phase = 'day' | 'night'

export interface Player {
    number: number
    name: string
    state: 'alive' | 'executed' | 'killed'
}

export interface Turn {
    turnNumber: number
    phase: Phase
    day: Day | null
    night: Night | null
}

export interface Day {
    nominations: Nomination[]
}

export interface Nomination {
    nominator: Player
    nominee: Player
    votes: Player[]
    ended: boolean
}

export interface Night {
}