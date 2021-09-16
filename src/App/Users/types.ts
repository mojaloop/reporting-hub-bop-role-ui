export interface User {
  id: string;
  name: string;
  assignedRoles: string[];
  assignableRoles: string[];
  assignedParticipants: string[];
  assignableParticipants: string[];
}

export interface UsersState {
  users: User[];
  usersError: string | null;
  isUsersRequestPending: boolean;
}

export interface ExtensionListItem {
  key: string;
  value: string;
}

export interface MojaloopError {
  errorInformation: MojaloopErrorInformation;
}

export interface MojaloopErrorInformation {
  errorCode: string;
  errorDescription: string;
  extensionList?: ExtensionListItem[];
}
