import React from 'react';
import { Modal, Pill, Heading, Table } from 'components';
import * as Icon from 'react-bootstrap-icons';
import { CheckedFunction } from '@modusbox/react-components/lib/components/Table/types';
import userProfileConnector, { UserProfileProps } from '../connectors';
import { RoleRow } from '../types';

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
}: UserProfileProps) {
  const roleRows: RoleRow[] = [];
  userProfile!.assignableRoles.forEach((role: any) => {
    roleRows.push({
      role,
    });
  });

  const isAssigned: CheckedFunction<RoleRow> = (row: RoleRow) => {
    return userProfile!.assignedRoles.includes(row.role);
  };

  return (
    <Modal
      title="Select Roles"
      onClose={onClickRoleModalClose}
      onSubmit={onClickUpdateRoles}
      submitLabel="Update Roles"
      isSubmitDisabled={false}
    >
      <div className="userProfile__modal">
        <Pill icon={<Icon.InfoCircle />} label="Click on a role to select it" />
        <Heading size="4">Roles</Heading>
        <Table columns={roleColumns} rows={roleRows} checked={isAssigned} flexible checkable />
      </div>
    </Modal>
  );
}

export default userProfileConnector(ChangeRolesModal);
