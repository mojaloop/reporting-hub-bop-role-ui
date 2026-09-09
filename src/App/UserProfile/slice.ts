import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Assignment, AssignmentChange, UserProfile, UserProfileState } from './types';

export const initialState: UserProfileState = {
  userProfile: null,
  userProfileError: null,
  userProfileAssignmentsError: null,
  isUserProfileRequestPending: true,
  showAddAssignmentModal: false,
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
    addAssignmentModalOpen(state: UserProfileState) {
      return {
        ...state,
        showAddAssignmentModal: true,
      };
    },
    addAssignmentModalClose(state: UserProfileState) {
      return {
        ...state,
        showAddAssignmentModal: false,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    requestAssignmentAdd(state: UserProfileState, action: PayloadAction<AssignmentChange>) {
      return {
        ...state,
        showAddAssignmentModal: false,
        userProfileAssignmentsError: initialState.userProfileAssignmentsError,
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    requestAssignmentRemove(state: UserProfileState, action: PayloadAction<AssignmentChange>) {
      return {
        ...state,
        userProfileAssignmentsError: initialState.userProfileAssignmentsError,
      };
    },
    setUserProfileAssignments(state: UserProfileState, action: PayloadAction<Assignment[]>) {
      return {
        ...state,
        userProfile: {
          ...state.userProfile!,
          assignments: action.payload,
        },
        userProfileAssignmentsError: initialState.userProfileAssignmentsError,
      };
    },
    setUserProfileAssignmentsError(state: UserProfileState, action: PayloadAction<string>) {
      return {
        ...state,
        userProfileAssignmentsError: action.payload,
      };
    },
  },
});

export const { reducer, actions } = slice;
export default reducer;
