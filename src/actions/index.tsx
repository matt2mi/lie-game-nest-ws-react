import * as constants from '../constants';
import { Result, Score } from '../types';

export interface SetPseudo {
    type: constants.SET_PSEUDO;
    payload: string;
}

export interface SetResultsAndScores {
    type: constants.SET_RESULTS_SCORES;
    payload: { results, scores };
}

export type PseudoAction = SetPseudo | SetResultsAndScores;

export const setPseudo = (pseudo: string): SetPseudo => {
    return {
        type: constants.SET_PSEUDO,
        payload: pseudo
    };
};

export const setResultsAndScores = (results: Result[], scores: Score[]): SetResultsAndScores => {
    return {
        type: constants.SET_RESULTS_SCORES,
        payload: {results, scores}
    };
};