import Playing from '../components/Playing';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import { PseudoAction, setResultsAndScores } from '../actions';

const mapStateToProps = ({pseudo = ''}: StoreState) => {
    return {pseudo};
};

const mapDispatchToProps = (dispatch: Dispatch<PseudoAction>) => {
    return {
        setResultsAndScores: (results, scores) => {
            dispatch(setResultsAndScores(results, scores));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Playing);