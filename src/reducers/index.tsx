import { EnthusiasmAction } from '../actions/index';
import { StoreState } from '../types';
import { DECREMENT_ENTHUSIASM, INCREMENT_ENTHUSIASM, SET_PSEUDO } from '../constants';

export function reducer(state: StoreState, action: EnthusiasmAction): StoreState {
    switch (action.type) {
        case INCREMENT_ENTHUSIASM:
            return {...state, enthusiasmLevel: state.enthusiasmLevel ? state.enthusiasmLevel + 1 : 1};
        case DECREMENT_ENTHUSIASM:
            return {
                ...state,
                enthusiasmLevel: state.enthusiasmLevel ?
                    Math.max(1, state.enthusiasmLevel - 1) : 1
            };
        case SET_PSEUDO:
            return {...state, pseudo: state.pseudo + action.payload};
        default:
            return state;
    }
}