import { State } from 'store/types';

// user profile selectors
export const getUserProfile = (state: State) => state.userProfile.userProfile;
export const getUserProfileError = (state: State) => state.userProfile.userProfileError;
export const getUserProfileAssignmentsError = (state: State) =>
  state.userProfile.userProfileAssignmentsError;
export const getIsUserProfileRequestPending = (state: State) =>
  state.userProfile.isUserProfileRequestPending;

// add assignment modal selectors
export const showAddAssignmentModal = (state: State) => state.userProfile.showAddAssignmentModal;
