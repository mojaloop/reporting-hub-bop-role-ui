import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, UsersState } from './types';

export const initialState: UsersState = {
  users: [],
  usersError: null,
  isUsersRequestPending: false,
};

const slice = createSlice({
  name: 'Sagas',
  initialState,
  reducers: {
    requestUsers(state: UsersState) {
      return {
        ...state,
        isUsersRequestPending: true,
      };
    },
    setUsers(state: UsersState, action: PayloadAction<User[]>) {
      return {
        ...state,
        users: action.payload,
        isUsersRequestPending: false,
      };
    },
    setUsersError(state: UsersState, action: PayloadAction<string>) {
      return {
        ...state,
        usersError: action.payload,
        isUsersRequestPending: false,
      };
    },
  },
});

export const { reducer, actions } = slice;
export default reducer;
