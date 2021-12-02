import React from 'react';
import { Modal, Pill, Heading, Table } from 'components';
import * as Icon from 'react-bootstrap-icons';
import { CheckedFunction } from '@modusbox/react-components/lib/components/Table/types';
import { useLocation } from 'react-router-dom';
import { userProfileRolesUpdateConnector, UserProfileRolesUpdateProps } from '../connectors';
import { RoleRow, RolesDelta } from '../types';

const roleColumns = [
  {
    label: 'Role Name',
    key: 'role',
  },
];

function ChangeRolesModal({
  userProfile,
  onClickRoleModalClose,
  onClickUpdateRoles,
}: UserProfileRolesUpdateProps) {
  const roleRows: RoleRow[] = [];
  userProfile!.assignableRoles.forEach((role: any) => {
    roleRows.push({
      role,
    });
  });

  const isAssigned: CheckedFunction<RoleRow> = (row: RoleRow) => {
    return userProfile!.assignedRoles.includes(row.role);
  };

  const { pathname } = useLocation();
  const diff = {
    id: pathname.split('/').pop(),
    requestDeletionRows: [],
    requestAssignmentRows: [],
  } as RolesDelta;

  let requestDeletionRows: RoleRow[] = [];
  let requestAssignmentRows: RoleRow[] = [];

  const checkRows = (rows: unknown[]) => {
    const checkedRows = roleRows.filter((x) => rows.includes(x));

    requestAssignmentRows = checkedRows.filter((x) => {
      return !userProfile!.assignedRoles.includes(x.role);
    });

    requestDeletionRows = roleRows
      .filter((x: RoleRow) => !rows.includes(x))
      .concat(rows.filter((x: RoleRow) => !roleRows.includes(x)) as RoleRow[]);
    diff.requestAssignmentRows = requestAssignmentRows;
    diff.requestDeletionRows = requestDeletionRows;
  };

  return (
    <Modal
      className="userProfile__role-update-modal"
      title="Select Roles"
      onClose={onClickRoleModalClose}
      onSubmit={() => onClickUpdateRoles(diff)}
      submitLabel="Update Roles"
      isSubmitDisabled={false}
    >
      <div className="userProfile__modal">
        <Pill icon={<Icon.InfoCircle />} label="Click on a role to select it" />
        <Heading size="4">Roles</Heading>
        <Table
          columns={roleColumns}
          rows={roleRows}
          checked={isAssigned}
          onCheck={checkRows}
          flexible
          checkable
        />
      </div>
    </Modal>
  );
}

export default userProfileRolesUpdateConnector(ChangeRolesModal);
