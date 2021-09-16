import { State, Dispatch } from 'store';
import ReduxContext from 'store/context';
import { connect, ConnectedProps } from 'react-redux';
import { actions } from './slice';
import * as selectors from './selectors';

const mapStateProps = (state: State) => ({
  userProfile: selectors.getUserProfile(state),
  userProfileError: selectors.getUserProfileError(state),
  isUserProfileRequestPending: selectors.getIsUserProfileRequestPending(state),
  showChangeRolesModal: selectors.showChangeRolesModal(state),
  showParticipantsRolesModal: selectors.showParticipantsRolesModal(state),
});

const mapDispatchProps = (dispatch: Dispatch) => ({
  onPageMount: (id: string) => dispatch(actions.requestUserProfile(id)),
  onClickChangeRoleButton: () => dispatch(actions.changeUserProfileRolesModalOpen()),
  onClickChangeParticipantsButton: () => dispatch(actions.changeUserProfileParticipantsModalOpen()),
  onClickRemoveRoleButton: (role: string) => dispatch(actions.requestUserProfileRoleRemove(role)),
  onClickRemoveParticipantButton: (participant: string) =>
    dispatch(actions.requestUserProfileParticipantRemove(participant)),
  onClickRoleModalClose: () => dispatch(actions.changeUserProfileRolesModalClose()),
  onClickUpdateRoles: () => dispatch(actions.requestUserProfileRolesUpdate()),
  onClickParticipantModalClose: () => dispatch(actions.changeUserProfileParticipantsModalClose()),
  onClickUpdateParticipants: () => dispatch(actions.requestUserProfileParticipantsUpdate()),
});

const userProfileConnector = connect(mapStateProps, mapDispatchProps, null, {
  context: ReduxContext,
});

export type UserProfileProps = ConnectedProps<typeof userProfileConnector>;
export default userProfileConnector;
