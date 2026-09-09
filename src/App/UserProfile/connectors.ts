import { State, Dispatch } from 'store';
import ReduxContext from 'store/context';
import { connect, ConnectedProps } from 'react-redux';
import { actions } from './slice';
import * as selectors from './selectors';
import { AssignmentChange } from './types';

const mapStatePropsUserProfile = (state: State) => ({
  userProfile: selectors.getUserProfile(state),
  userProfileError: selectors.getUserProfileError(state),
  userProfileAssignmentsError: selectors.getUserProfileAssignmentsError(state),
  isUserProfileRequestPending: selectors.getIsUserProfileRequestPending(state),
  showAddAssignmentModal: selectors.showAddAssignmentModal(state),
});

const mapDispatchPropsUserProfile = (dispatch: Dispatch) => ({
  onPageMount: (id: string) => dispatch(actions.requestUserProfile(id)),
  onClickAddAssignmentButton: () => dispatch(actions.addAssignmentModalOpen()),
  onClickRemoveAssignmentButton: (change: AssignmentChange) =>
    dispatch(actions.requestAssignmentRemove(change)),
});

const mapStatePropsAddAssignment = (state: State) => ({
  userProfile: selectors.getUserProfile(state),
});

const mapDispatchPropsAddAssignment = (dispatch: Dispatch) => ({
  onClickModalClose: () => dispatch(actions.addAssignmentModalClose()),
  onClickAdd: (change: AssignmentChange) => dispatch(actions.requestAssignmentAdd(change)),
});

export const userProfileConnector = connect(
  mapStatePropsUserProfile,
  mapDispatchPropsUserProfile,
  null,
  {
    context: ReduxContext,
  },
);

export const addAssignmentConnector = connect(
  mapStatePropsAddAssignment,
  mapDispatchPropsAddAssignment,
  null,
  {
    context: ReduxContext,
  },
);

export type UserProfileProps = ConnectedProps<typeof userProfileConnector>;
export type AddAssignmentProps = ConnectedProps<typeof addAssignmentConnector>;
