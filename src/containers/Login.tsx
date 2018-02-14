import Login from '../components/Login';
import * as actions from '../actions';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';

export function mapStateToProps({pseudo = ''}: StoreState) {
    return {pseudo};
}

export function mapDispatchToProps(dispatch: Dispatch<actions.EnthusiasmAction>) {
    return {
        setPseudo: (pseudo: string) => {
            dispatch(actions.setPseudo(pseudo));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);