import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  UserProfile,
  UserProfileState,
  RoleDeletionItem,
  ParticipantDeletionItem,
  RolesDelta,
  ParticipantsDelta,
} from './types';

export const initialState: UserProfileState = {
  userProfile: null,
  userProfileError: null,
  userProfileRolesError: null,
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
    requestUserProfileRoleRemove(state: UserProfileState, action: PayloadAction<RoleDeletionItem>) {
      return {
        ...state,
      };
    },
    requestUserProfileParticipantRemove(
      state: UserProfileState,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: PayloadAction<ParticipantDeletionItem>,
    ) {
      return {
        ...state,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    requestUserProfileRolesUpdate(state: UserProfileState, action: PayloadAction<RolesDelta>) {
      return {
        ...state,
        showChangeRolesModal: false,
      };
    },
    setUserProfileRoles(state: UserProfileState, action: PayloadAction<string[]>) {
      return {
        ...state,
        userProfile: {
          ...state.userProfile!,
          assignedRoles: action.payload,
        },
        userProfileRolesError: initialState.userProfileRolesError,
      };
    },
    setUserProfileRolesError(state: UserProfileState, action: PayloadAction<string>) {
      return {
        ...state,
        userProfileRolesError: action.payload,
      };
    },
    requestUserProfileParticipantsUpdate(
      state: UserProfileState,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: PayloadAction<ParticipantsDelta>,
    ) {
      return {
        ...state,
        showChangeParticipantsModal: false,
      };
    },
    setUserProfileParticipants(state: UserProfileState, action: PayloadAction<string[]>) {
      return {
        ...state,
        userProfile: {
          ...state.userProfile!,
          assignedParticipants: action.payload,
        },
      };
    },
  },
});

export const { reducer, actions } = slice;
export default reducer;
