import React from 'react';
import { MessageBox, Spinner, Heading, Table, Button } from 'components';
import { useLocation } from 'react-router-dom';
import './UserProfile.scss';
import AddAssignment from './components/AddAssignment';
import { userProfileConnector, UserProfileProps } from './connectors';
import { Assignment } from './types';

const assignmentColumns = [
  {
    label: 'Role',
    key: 'role',
  },
  {
    label: 'Over',
    key: 'over',
  },
  {
    label: '',
    key: 'removeButton',
    sortable: false,
    searchable: false,
    bodyClassName: 'userProfile__removeButton',
  },
];

/** What a role is over, in the operator's words rather than the graph's. */
const describe = (assignment: Assignment): string => {
  const named = Object.entries(assignment.resources);
  return named.length === 0
    ? 'everything the role covers'
    : named.map(([resourceName, id]) => `${resourceName}: ${id}`).join(', ');
};

function UserProfile({
  userProfile,
  userProfileError,
  userProfileAssignmentsError,
  isUserProfileRequestPending,
  showAddAssignmentModal,
  onPageMount,
  onClickAddAssignmentButton,
  onClickRemoveAssignmentButton,
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
    const assignmentRows = userProfile!.assignments.map((assignment) => ({
      role: assignment.role,
      over: describe(assignment),
      removeButton: (
        <Button
          noFill
          className="userProfile__button"
          size="small"
          kind="primary"
          label="Remove"
          onClick={() => onClickRemoveAssignmentButton({ id, assignment })}
        />
      ),
    }));

    let assignmentsErrorContent = null;
    if (userProfileAssignmentsError) {
      assignmentsErrorContent = (
        <MessageBox kind="danger">
          Error updating what this user holds: {userProfileAssignmentsError}
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
            label="Add Assignment"
            onClick={onClickAddAssignmentButton}
          />
          <Table columns={assignmentColumns} rows={assignmentRows} flexible />
        </div>
        {assignmentsErrorContent}
      </div>
    );
  }

  return (
    <div>
      {content}
      {showAddAssignmentModal ? <AddAssignment /> : null}
    </div>
  );
}

export default userProfileConnector(UserProfile);
