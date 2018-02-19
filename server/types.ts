export type Question = {
    text: string;
    answers: string[];
    lies: string[];
}

export type Answer = {
    pseudo: string;
    lie: Lie;
}

export type Lie = {
    pseudo: string;
    value: string;
}

export type Player = {
    id: number;
    pseudo: string;
}