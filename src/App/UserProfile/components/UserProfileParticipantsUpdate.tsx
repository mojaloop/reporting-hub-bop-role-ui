import React from 'react';
import { Modal, Pill, Heading, Table } from 'components';
import * as Icon from 'react-bootstrap-icons';
import { CheckedFunction } from '@modusbox/react-components/lib/components/Table/types';
import { useLocation } from 'react-router-dom';
import {
  userProfileParticipantsUpdateConnector,
  UserProfileParticipantsUpdateProps,
} from '../connectors';
import { ParticipantRow, ParticipantsDelta } from '../types';

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
}: UserProfileParticipantsUpdateProps) {
  const participantRows: ParticipantRow[] = [];
  userProfile!.assignableParticipants.forEach((participant) => {
    participantRows.push({
      participant,
    });
  });

  const isAssigned: CheckedFunction<ParticipantRow> = (row: ParticipantRow) => {
    return userProfile!.assignedParticipants.includes(row.participant);
  };

  const { pathname } = useLocation();
  const diff = {
    id: pathname.split('/').pop(),
    requestDeletionRows: [],
    requestAssignmentRows: [],
  } as ParticipantsDelta;

  let requestDeletionRows: ParticipantRow[] = [];
  let requestAssignmentRows: ParticipantRow[] = [];

  const checkRows = (rows: unknown[]) => {
    const checkedRows = participantRows.filter((x) => rows.includes(x));

    requestAssignmentRows = checkedRows.filter((x) => {
      return !userProfile!.assignedParticipants.includes(x.participant);
    });

    requestDeletionRows = participantRows
      .filter((x: ParticipantRow) => !rows.includes(x))
      .concat(rows.filter((x: ParticipantRow) => !participantRows.includes(x)) as ParticipantRow[]);
    diff.requestAssignmentRows = requestAssignmentRows;
    diff.requestDeletionRows = requestDeletionRows;
  };

  return (
    <Modal
      title="Select Companies"
      onClose={onClickParticipantModalClose}
      onSubmit={() => onClickUpdateParticipants(diff)}
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
          onCheck={checkRows}
          flexible
          checkable
        />
      </div>
    </Modal>
  );
}

export default userProfileParticipantsUpdateConnector(ChangeParticipantsModal);
