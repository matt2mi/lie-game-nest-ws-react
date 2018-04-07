import Login from '../../components/players-screens/Login';
import { PseudoAction, setPseudo } from '../../actions';
import { StoreState } from '../../types';
import { connect, Dispatch } from 'react-redux';

const mapStateToProps = ({pseudo = ''}: StoreState) => {
    return {pseudo};
};

const mapDispatchToProps = (dispatch: Dispatch<PseudoAction>) => {
    return {
        setPseudo: (pseudo: string) => {
            dispatch(setPseudo(pseudo));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);