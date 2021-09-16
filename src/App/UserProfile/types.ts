import { Row } from '@modusbox/react-components/lib/components/Table/types';

export interface UserProfile {
  id: string;
  name: string;
  assignedRoles: string[];
  assignableRoles: string[];
  assignedParticipants: string[];
  assignableParticipants: string[];
}

export interface UserProfileState {
  userProfile: UserProfile | null;
  userProfileError: string | null;
  isUserProfileRequestPending: boolean;
  showChangeRolesModal: boolean;
  showChangeParticipantsModal: boolean;
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
