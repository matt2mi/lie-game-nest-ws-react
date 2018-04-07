import PlayerAnswering from '../components/PlayerAnswering';
import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';

const mapStateToProps = ({pseudo = ''}: StoreState) => {
    return {pseudo};
};

export default connect(mapStateToProps, null)(PlayerAnswering);