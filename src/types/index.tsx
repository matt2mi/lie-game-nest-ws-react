export interface StoreState {
    pseudo?: string;
    results?: ReadonlyArray<Result>;
    scores?: ReadonlyArray<Score>;
    nbRounds?: number;
}

export interface Lie {
    pseudo: string;
    lieValue: string;
}

export interface Question {
    text: string;
    answers: ReadonlyArray<string>;
    lies: ReadonlyArray<string>;
}

export interface Result {
    id: number;
    lieValue: string;
    liarPseudo: string;
    playerPseudo: string;
}

export interface Score {
    id: number;
    pseudo: string;
    value: number;
}