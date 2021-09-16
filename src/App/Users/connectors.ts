import { State, Dispatch } from 'store';
import ReduxContext from 'store/context';
import { connect, ConnectedProps } from 'react-redux';
import { actions } from './slice';
import * as selectors from './selectors';

const mapStateProps = (state: State) => ({
  users: selectors.getUsers(state),
  usersError: selectors.getUsersError(state),
  isUsersRequestPending: selectors.isUsersRequestPending(state),
});

const mapDispatchProps = (dispatch: Dispatch) => ({
  onPageMount: () => dispatch(actions.requestUsers()),
});

const usersConnector = connect(mapStateProps, mapDispatchProps, null, {
  context: ReduxContext,
});

export type UsersProps = ConnectedProps<typeof usersConnector>;
export default usersConnector;
