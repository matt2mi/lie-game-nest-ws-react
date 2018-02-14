import * as constants from '../constants';

export interface IncrementEnthusiasm {
    type: constants.INCREMENT_ENTHUSIASM;
    payload?: string;
}

export interface DecrementEnthusiasm {
    type: constants.DECREMENT_ENTHUSIASM;
    payload?: string;
}

export interface SetPseudo {
    type: constants.SET_PSEUDO;
    payload: string;
}

export type EnthusiasmAction = IncrementEnthusiasm | DecrementEnthusiasm | SetPseudo;

export function incrementEnthusiasm(): IncrementEnthusiasm {
    console.warn('action');
    return {
        type: constants.INCREMENT_ENTHUSIASM
    };
}

export function decrementEnthusiasm(): DecrementEnthusiasm {
    return {
        type: constants.DECREMENT_ENTHUSIASM
    };
}

export function setPseudo(pseudo: string): SetPseudo {
    return {
        type: constants.SET_PSEUDO,
        payload: pseudo
    };
}