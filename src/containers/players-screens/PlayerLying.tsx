import { StoreState } from '../../types';
import { connect } from 'react-redux';
import PlayerLying from '../../components/players-screens/PlayerLying';

const mapStateToProps = ({pseudo = ''}: StoreState) => {
    return {pseudo};
};

export default connect(mapStateToProps, null)(PlayerLying);