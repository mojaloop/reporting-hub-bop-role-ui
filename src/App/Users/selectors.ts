import { State } from 'store';

export const getUsers = (state: State) => state.users.users;
export const getUsersError = (state: State) => state.users.usersError;
export const isUsersRequestPending = (state: State) => state.users.isUsersRequestPending;
