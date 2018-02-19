import { PseudoAction } from '../actions';
import { StoreState } from '../types';
import { SET_PSEUDO } from '../constants';

export function reducer(state: StoreState, action: PseudoAction): StoreState {
    switch (action.type) {
        case SET_PSEUDO:
            return {...state, pseudo: state.pseudo + action.payload};
        default:
            return state;
    }
}