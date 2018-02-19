import * as constants from '../constants';

export interface SetPseudo {
    type: constants.SET_PSEUDO;
    payload: string;
}

export type PseudoAction = SetPseudo;

export const setPseudo = (pseudo: string): SetPseudo => {
    return {
        type: constants.SET_PSEUDO,
        payload: pseudo
    };
};