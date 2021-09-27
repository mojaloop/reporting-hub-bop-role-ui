import { State, Dispatch } from 'store';
import ReduxContext from 'store/context';
import { connect, ConnectedProps } from 'react-redux';
import { actions } from './slice';
import * as selectors from './selectors';
import { RolesDelta, ParticipantsDelta, RoleDeletionItem, ParticipantDeletionItem } from './types';

const mapStatePropsUserProfile = (state: State) => ({
  userProfile: selectors.getUserProfile(state),
  userProfileError: selectors.getUserProfileError(state),
  isUserProfileRequestPending: selectors.getIsUserProfileRequestPending(state),
  showChangeRolesModal: selectors.showChangeRolesModal(state),
  showParticipantsRolesModal: selectors.showParticipantsRolesModal(state),
});

const mapDispatchPropsUserProfile = (dispatch: Dispatch) => ({
  onPageMount: (id: string) => dispatch(actions.requestUserProfile(id)),
  onClickChangeRoleButton: () => dispatch(actions.changeUserProfileRolesModalOpen()),
  onClickChangeParticipantsButton: () => dispatch(actions.changeUserProfileParticipantsModalOpen()),
  onClickRemoveRoleButton: (item: RoleDeletionItem) =>
    dispatch(actions.requestUserProfileRoleRemove(item)),
  onClickRemoveParticipantButton: (item: ParticipantDeletionItem) =>
    dispatch(actions.requestUserProfileParticipantRemove(item)),
});

const mapStatePropsUserProfileParticipantsUpdate = (state: State) => ({
  userProfile: selectors.getUserProfile(state),
});

const mapDispatchPropsUserProfileParticipantsUpdate = (dispatch: Dispatch) => ({
  onClickParticipantModalClose: () => dispatch(actions.changeUserProfileParticipantsModalClose()),
  onClickUpdateParticipants: (diff: ParticipantsDelta) =>
    dispatch(actions.requestUserProfileParticipantsUpdate(diff)),
});

const mapStatePropsUserProfileRolesUpdate = (state: State) => ({
  userProfile: selectors.getUserProfile(state),
});

const mapDispatchPropsUserProfileRolesUpdate = (dispatch: Dispatch) => ({
  onClickRoleModalClose: () => dispatch(actions.changeUserProfileRolesModalClose()),
  onClickUpdateRoles: (diff: RolesDelta) => dispatch(actions.requestUserProfileRolesUpdate(diff)),
});

export const userProfileConnector = connect(
  mapStatePropsUserProfile,
  mapDispatchPropsUserProfile,
  null,
  {
    context: ReduxContext,
  },
);

export const userProfileParticipantsUpdateConnector = connect(
  mapStatePropsUserProfileParticipantsUpdate,
  mapDispatchPropsUserProfileParticipantsUpdate,
  null,
  {
    context: ReduxContext,
  },
);

export const userProfileRolesUpdateConnector = connect(
  mapStatePropsUserProfileRolesUpdate,
  mapDispatchPropsUserProfileRolesUpdate,
  null,
  {
    context: ReduxContext,
  },
);

export type UserProfileProps = ConnectedProps<typeof userProfileConnector>;
export type UserProfileParticipantsUpdateProps = ConnectedProps<
  typeof userProfileParticipantsUpdateConnector
>;
export type UserProfileRolesUpdateProps = ConnectedProps<typeof userProfileRolesUpdateConnector>;
