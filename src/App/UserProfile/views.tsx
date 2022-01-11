import React from 'react';
import { MessageBox, Spinner, Heading, Table, Button } from 'components';
import { useLocation } from 'react-router-dom';
import './UserProfile.scss';
import UserProfileRolesUpdate from './components/UserProfileRolesUpdate';
import UserProfileParticipantsUpdate from './components/UserProfileParticipantsUpdate';
import { userProfileConnector, UserProfileProps } from './connectors';

const roleColumns = [
  {
    label: 'Role Name',
    key: 'role',
  },
  {
    label: '',
    key: 'removeButton',
    sortable: false,
    searchable: false,
    bodyClassName: 'userProfile__removeButton',
  },
];

const participantColumns = [
  {
    label: 'Company Name',
    key: 'participant',
  },
  {
    label: '',
    key: 'removeButton',
    sortable: false,
    searchable: false,
    bodyClassName: 'userProfile__removeButton',
  },
];

function UserProfile({
  userProfile,
  userProfileError,
  userProfileRolesError,
  isUserProfileRequestPending,
  showChangeRolesModal,
  showParticipantsRolesModal,
  onPageMount,
  onClickChangeRoleButton,
  onClickChangeParticipantsButton,
  onClickRemoveRoleButton,
  onClickRemoveParticipantButton,
}: UserProfileProps) {
  const { pathname } = useLocation();
  const id = pathname.split('/').pop()!;
  // @ts-ignore
  React.useEffect(() => onPageMount(id), []);

  let content = null;
  if (userProfileError) {
    content = (
      <MessageBox kind="danger">Error fetching user profile: {userProfileError}</MessageBox>
    );
  } else if (isUserProfileRequestPending) {
    content = <Spinner center />;
  } else {
    const roleRows: Record<string, unknown>[] = [];
    const participantRows: Record<string, unknown>[] = [];
    userProfile!.assignedRoles.forEach((role) => {
      roleRows.push({
        role,
        removeButton: (
          <Button
            noFill
            className="userProfile__button"
            size="small"
            kind="primary"
            label="Remove Role"
            onClick={() => onClickRemoveRoleButton({ id, roleId: role })}
          />
        ),
      });
    });
    userProfile!.assignedParticipants.forEach((participant) => {
      participantRows.push({
        participant,
        removeButton: (
          <Button
            noFill
            className="userProfile__button"
            size="small"
            kind="primary"
            label="Remove Company"
            onClick={() => onClickRemoveParticipantButton({ id, participantId: participant })}
          />
        ),
      });
    });

    let userProfileRolesErrorContent = null;
    if (userProfileRolesError) {
      userProfileRolesErrorContent = (
        <MessageBox kind="danger">
          Error updating the user roles: {userProfileRolesError}
        </MessageBox>
      );
    }

    content = (
      <div>
        <Heading size="3">{userProfile!.username}</Heading>
        <div className="userProfile__roles">
          <Heading size="4">Roles</Heading>
          <Button
            noFill
            className="userProfile__button"
            size="medium"
            kind="primary"
            label="Update Roles"
            onClick={onClickChangeRoleButton}
          />
          <Table columns={roleColumns} rows={roleRows} flexible />
        </div>
        {userProfileRolesErrorContent}
        <div className="userProfile__participants">
          <Heading size="4">Participant Companies</Heading>
          <Button
            noFill
            className="userProfile__button"
            size="medium"
            kind="primary"
            label="Update Companies"
            onClick={onClickChangeParticipantsButton}
          />
          <Table columns={participantColumns} rows={participantRows} flexible />
        </div>
      </div>
    );
  }

  let roleModal = null;
  if (showChangeRolesModal) {
    roleModal = <UserProfileRolesUpdate />;
  }

  let participantModal = null;
  if (showParticipantsRolesModal) {
    participantModal = <UserProfileParticipantsUpdate />;
  }

  return (
    <div>
      {content}
      {roleModal}
      {participantModal}
    </div>
  );
}

export default userProfileConnector(UserProfile);
