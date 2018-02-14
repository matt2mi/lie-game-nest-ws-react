import NavHeader from '../components/NavHeader';
import { StoreState } from '../types';
import { connect } from 'react-redux';

export function mapStateToProps({pseudo = ''}: StoreState) {
    return {pseudo};
}

export default connect(mapStateToProps, null)(NavHeader);