export interface User {
  id: string;
  name: Name | undefined;
  emails: string[] | undefined;
  username: string | undefined;
}

export interface Name {
  givenName: string | undefined;
  familyName: string | undefined;
}

export interface UsersState {
  users: User[];
  usersError: string | null;
  isUsersRequestPending: boolean;
}

export interface FetchUsersResponse {
  users: User[];
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
