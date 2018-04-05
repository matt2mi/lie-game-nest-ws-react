import { StoreState } from '../types';
import { connect, Dispatch } from 'react-redux';
import PlayerLying from '../components/PlayerLying';

const mapStateToProps = ({pseudo = ''}: StoreState) => {
    return {pseudo};
};

export default connect(mapStateToProps, null)(PlayerLying);