import { Row } from '@modusbox/react-components/lib/components/Table/types';

export interface User {
  id: string;
  username: string;
}

export interface Role {
  name: string;
  /** The resource names the role's grants leave open, for an assignment to name. */
  open: string[];
}

export interface Resource {
  resourceName: string;
  id: string;
}

/** One role a user holds, and what it is over. */
export interface Assignment {
  role: string;
  resources: Record<string, string>;
}

export interface UserProfile {
  id: string;
  username: string;
  assignments: Assignment[];
  assignableRoles: Role[];
  /** The resources a role can be given over, keyed by resource name. */
  resources: Record<string, string[]>;
}

export interface UserProfileState {
  userProfile: UserProfile | null;
  userProfileError: string | null;
  userProfileAssignmentsError: string | null;
  isUserProfileRequestPending: boolean;
  showAddAssignmentModal: boolean;
}

export interface AssignmentChange {
  id: string;
  assignment: Assignment;
}

export interface FetchRolesResponse {
  roles: Role[];
}

export interface FetchResourcesResponse {
  resources: Resource[];
}

export interface FetchAssignmentsResponse {
  assignments: Assignment[];
}

export interface FetchUserByIdResponse {
  user: User;
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

export interface AssignmentRow extends Row {
  role: string;
  over: string;
}
