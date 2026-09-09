import React from 'react';
import { Modal, Pill, Heading, Select } from 'components';
import * as Icon from 'react-bootstrap-icons';
import { useLocation } from 'react-router-dom';
import { addAssignmentConnector, AddAssignmentProps } from '../connectors';
import { Role } from '../types';

/**
 * A role, and one resource per resource name its grants leave open. A role
 * that leaves none open is held as it is; a role that leaves two is a
 * different holding for every pair, which is what lets someone see one report
 * for one participant and another report for another.
 */
function AddAssignment({ userProfile, onClickModalClose, onClickAdd }: AddAssignmentProps) {
  const roles = userProfile!.assignableRoles;
  const [roleName, setRoleName] = React.useState<string>(roles[0]?.name ?? '');
  const [picked, setPicked] = React.useState<Record<string, string>>({});

  const role: Role | undefined = roles.find((r) => r.name === roleName);
  const { pathname } = useLocation();
  const id = pathname.split('/').pop()!;

  const options = (resourceName: string) =>
    (userProfile!.resources[resourceName] ?? []).map((resource) => ({
      label: resource,
      value: resource,
    }));

  const chosen = (resourceName: string) =>
    picked[resourceName] ?? options(resourceName)[0]?.value ?? '';
  const complete = (role?.open ?? []).every((resourceName) => chosen(resourceName) !== '');
  const chosenResources = () =>
    Object.fromEntries(
      (role?.open ?? []).map((resourceName) => [resourceName, chosen(resourceName)]),
    );
  const submit = () =>
    onClickAdd({ id, assignment: { role: roleName, resources: chosenResources() } });

  return (
    <Modal
      className="userProfile__assignment-modal"
      title="Add Assignment"
      onClose={onClickModalClose}
      onSubmit={submit}
      submitLabel="Add"
      isSubmitDisabled={!role || !complete}
    >
      <div className="userProfile__modal">
        <Pill icon={<Icon.InfoCircle />} label="A role applies to the resources you choose here" />
        <Heading size="4">Role</Heading>
        <Select
          id="assignment__role"
          options={roles.map((r) => ({ label: r.name, value: r.name }))}
          value={roleName}
          onChange={(value) => {
            setRoleName(String(value));
            setPicked({});
          }}
        />
        {(role?.open ?? []).map((resourceName) => (
          <div key={resourceName}>
            <Heading size="4">{resourceName}</Heading>
            <Select
              id={`assignment__${resourceName}`}
              options={options(resourceName)}
              value={chosen(resourceName)}
              onChange={(value) => setPicked({ ...picked, [resourceName]: String(value) })}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default addAssignmentConnector(AddAssignment);
