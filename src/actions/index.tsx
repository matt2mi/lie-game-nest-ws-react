import * as constants from '../constants';
import { Result, Score } from '../types';

export interface SetPseudo {
    type: constants.SET_PSEUDO;
    payload: string;
}

export interface SetResultsAndScores {
    type: constants.SET_RESULTS_SCORES;
    payload: {
        results: ReadonlyArray<Result>,
        scores: ReadonlyArray<Score>
    };
}

export interface SetNbRounds {
    type: constants.SET_NB_ROUNDS;
    payload: number;
}

export type PseudoAction = SetPseudo | SetResultsAndScores | SetNbRounds;

export const setPseudo = (pseudo: string): SetPseudo => {
    return {
        type: constants.SET_PSEUDO,
        payload: pseudo
    };
};

export const setResultsAndScores = (results: ReadonlyArray<Result>,
                                    scores: ReadonlyArray<Score>): SetResultsAndScores => {
    return {
        type: constants.SET_RESULTS_SCORES,
        payload: {results, scores}
    };
};

export const setNbRounds = (nbRounds: number): SetNbRounds => {
    return {
        type: constants.SET_NB_ROUNDS,
        payload: nbRounds
    };
};