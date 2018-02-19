import Login from '../components/Login';
import { PseudoAction, setPseudo } from '../actions';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({pseudo = ''}: StoreState) {
    return {pseudo};
}

export function mapDispatchToProps(dispatch: Dispatch<PseudoAction>) {
    return {
        setPseudo: (pseudo: string) => {
            dispatch(setPseudo(pseudo));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);