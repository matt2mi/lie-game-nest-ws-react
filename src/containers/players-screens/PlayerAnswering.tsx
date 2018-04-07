import PlayerAnswering from '../../components/players-screens/PlayerAnswering';
import { StoreState } from '../../types';
import { connect } from 'react-redux';

const mapStateToProps = ({pseudo = ''}: StoreState) => {
    return {pseudo};
};

export default connect(mapStateToProps, null)(PlayerAnswering);