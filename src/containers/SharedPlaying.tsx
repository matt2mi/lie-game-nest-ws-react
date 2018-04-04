import SharedPlaying from '../components/SharedPlaying';
import { connect, Dispatch } from 'react-redux';
import { PseudoAction, setNbRounds, setResultsAndScores } from '../actions';

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

export default connect(null, mapDispatchToProps)(SharedPlaying);