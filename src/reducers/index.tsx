import { PseudoAction } from '../actions';
import { Score, StoreState } from '../types';
import { SET_NB_ROUNDS, SET_PSEUDO, SET_RESULTS_SCORES } from '../constants';

export function reducer(state: StoreState, action: PseudoAction): StoreState {
    switch (action.type) {
        case SET_PSEUDO:
            return {...state, pseudo: action.payload};
        case SET_RESULTS_SCORES:
            const sortedScores: ReadonlyArray<Score> = action.payload.scores.sort((a, b) => {
                if (a.value < b.value) return -1;
                if (a.value == b.value) return 0;
                return 1;
            });
            return {...state, results: action.payload.results, scores: sortedScores};
        case SET_NB_ROUNDS:
            return {...state, nbRounds: action.payload};
        default:
            return state;
    }
}