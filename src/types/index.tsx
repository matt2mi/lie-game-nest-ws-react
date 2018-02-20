export interface StoreState {
    pseudo?: string;
    results?: Result[];
    scores?: Score[];
}

export interface Lie {
    pseudo: string;
    lieValue: string;
}

export interface Question {
    text: string;
    answers: string[];
    lies: string[];
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