import { Row } from '@modusbox/react-components/lib/components/Table/types';

export interface User {
  id: string;
  username: string;
}
export interface UserProfile {
  id: string;
  username: string;
  assignedRoles: string[];
  assignableRoles: string[];
  assignedParticipants: string[];
  assignableParticipants: string[];
}

export interface UserProfileState {
  userProfile: UserProfile | null;
  userProfileError: string | null;
  userProfileRolesError: string | null;
  isUserProfileRequestPending: boolean;
  showChangeRolesModal: boolean;
  showChangeParticipantsModal: boolean;
}

export interface RolesDelta {
  id: string;
  requestDeletionRows: RoleRow[];
  requestAssignmentRows: RoleRow[];
}

export interface ParticipantsDelta {
  id: string;
  requestDeletionRows: ParticipantRow[];
  requestAssignmentRows: ParticipantRow[];
}

export interface RoleDeletionItem {
  id: string;
  roleId: string;
}

export interface ParticipantDeletionItem {
  id: string;
  participantId: string;
}

export interface FetchRolesResponse {
  roles: string[];
}

export interface FetchParticipantsResponse {
  participants: string[];
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

export interface RoleRow extends Row {
  role: string;
}

export interface ParticipantRow extends Row {
  participant: string;
}
