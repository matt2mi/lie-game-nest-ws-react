import Playing from '../components/Playing';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import { PseudoAction, setNbRounds, setResultsAndScores } from '../actions';

const mapStateToProps = ({pseudo = ''}: StoreState) => {
    return {pseudo};
};

const mapDispatchToProps = (dispatch: Dispatch<PseudoAction>) => {
    return {
        setResultsAndScores: (results, scores) => {
            dispatch(setResultsAndScores(results, scores));
        },
        setNbRounds: (nbRounds: number) => {
            dispatch(setNbRounds(nbRounds));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Playing);