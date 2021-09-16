import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile, UserProfileState } from './types';

export const initialState: UserProfileState = {
  userProfile: null,
  userProfileError: null,
  isUserProfileRequestPending: true,
  showChangeRolesModal: false,
  showChangeParticipantsModal: false,
};

const slice = createSlice({
  name: 'Sagas',
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    requestUserProfile(state: UserProfileState, action: PayloadAction<string>) {
      return {
        ...state,
        userProfile: initialState.userProfile,
        userProfileError: initialState.userProfileError,
        isUserProfileRequestPending: true,
      };
    },
    setUserProfile(state: UserProfileState, action: PayloadAction<UserProfile>) {
      return {
        ...state,
        userProfile: action.payload,
        isUserProfileRequestPending: false,
      };
    },
    setUserProfileError(state: UserProfileState, action: PayloadAction<string>) {
      return {
        ...state,
        userProfileError: action.payload,
        isUserProfileRequestPending: false,
      };
    },
    changeUserProfileRolesModalOpen(state: UserProfileState) {
      return {
        ...state,
        showChangeRolesModal: true,
      };
    },
    changeUserProfileRolesModalClose(state: UserProfileState) {
      return {
        ...state,
        showChangeRolesModal: false,
      };
    },
    changeUserProfileParticipantsModalOpen(state: UserProfileState) {
      return {
        ...state,
        showChangeParticipantsModal: true,
      };
    },
    changeUserProfileParticipantsModalClose(state: UserProfileState) {
      return {
        ...state,
        showChangeParticipantsModal: false,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    requestUserProfileRoleRemove(state: UserProfileState, action: PayloadAction<string>) {
      return {
        ...state,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    requestUserProfileParticipantRemove(state: UserProfileState, action: PayloadAction<string>) {
      return {
        ...state,
      };
    },
    requestUserProfileRolesUpdate(state: UserProfileState) {
      return {
        ...state,
      };
    },
    requestUserProfileParticipantsUpdate(state: UserProfileState) {
      return {
        ...state,
      };
    },
  },
});

export const { reducer, actions } = slice;
export default reducer;
