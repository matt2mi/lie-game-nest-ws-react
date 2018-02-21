import { PseudoAction } from '../actions';
import { StoreState } from '../types';
import { SET_NB_ROUNDS, SET_PSEUDO, SET_RESULTS_SCORES } from '../constants';

export function reducer(state: StoreState, action: PseudoAction): StoreState {
    switch (action.type) {
        case SET_PSEUDO:
            return {...state, pseudo: action.payload};
        case SET_RESULTS_SCORES:
            return {...state, results: action.payload.results, scores: action.payload.scores};
        case SET_NB_ROUNDS:
            return {...state, nbRounds: action.payload};
        default:
            return state;
    }
}