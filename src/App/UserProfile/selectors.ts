import { State } from 'store/types';

// user profile selectors
export const getUserProfile = (state: State) => state.userProfile.userProfile;
export const getUserProfileError = (state: State) => state.userProfile.userProfileError;
export const getUserProfileRolesError = (state: State) => state.userProfile.userProfileRolesError;
export const getIsUserProfileRequestPending = (state: State) =>
  state.userProfile.isUserProfileRequestPending;

// user profile update roles modal selectors
export const showChangeRolesModal = (state: State) => state.userProfile.showChangeRolesModal;

// user profile update participant modal selectors
export const showParticipantsRolesModal = (state: State) =>
  state.userProfile.showChangeParticipantsModal;
