import React from 'react';
import { Modal, Pill, Heading, Table } from 'components';
import * as Icon from 'react-bootstrap-icons';
import { CheckedFunction } from '@modusbox/react-components/lib/components/Table/types';
import userProfileConnector, { UserProfileProps } from '../connectors';
import { ParticipantRow } from '../types';

const participantColumns = [
  {
    label: 'Participant Companies',
    key: 'participant',
  },
];

function ChangeParticipantsModal({
  userProfile,
  onClickParticipantModalClose,
  onClickUpdateParticipants,
}: UserProfileProps) {
  const participantRows: ParticipantRow[] = [];
  userProfile!.assignableParticipants.forEach((participant) => {
    participantRows.push({
      participant,
    });
  });

  const isAssigned: CheckedFunction<ParticipantRow> = (row: ParticipantRow) => {
    return userProfile!.assignedParticipants.includes(row.participant);
  };

  return (
    <Modal
      title="Select Companies"
      onClose={onClickParticipantModalClose}
      onSubmit={onClickUpdateParticipants}
      submitLabel="Update Companies"
      isSubmitDisabled={false}
    >
      <div className="userProfile__modal">
        <Pill icon={<Icon.InfoCircle />} label="Click on a company to select it" />
        <Heading size="4">Companies</Heading>
        <Table
          columns={participantColumns}
          rows={participantRows}
          checked={isAssigned}
          flexible
          checkable
        />
      </div>
    </Modal>
  );
}

export default userProfileConnector(ChangeParticipantsModal);
