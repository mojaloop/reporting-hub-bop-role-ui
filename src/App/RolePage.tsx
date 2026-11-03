import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { IamEvent, IamRoleEditorElement } from '@mojaloop/authz-ui/elements';
import { useIam } from '../iam';
import { flag, RoleEditorElement, useIamElement } from './elements';
import { useBasePath } from './hooks';
import { Allowed, Page } from './Page';
import { rolePath, rolesPath, RouteParam } from './paths';
import { Operation, usePermissions } from './permissions';

/** One role, changed when the IAM owns it and the caller may, read otherwise. */
export function RolePage() {
  const { [RouteParam.role]: name } = useParams<Record<typeof RouteParam.role, string>>();
  const { apiBase } = useIam();
  const { can } = usePermissions();
  const base = useBasePath();
  const history = useHistory();
  const toRoles = () => history.push(rolesPath(base));
  const editor = useIamElement<IamRoleEditorElement>({
    [IamEvent.roleSaved]: toRoles,
    [IamEvent.roleDeleted]: toRoles,
  });

  return (
    <Page title={name} back={{ to: rolesPath(base), label: 'Roles' }}>
      <Allowed operation={Operation.getRole} refusal="You may not read roles.">
        <RoleEditorElement
          ref={editor}
          api-base={apiBase}
          role-name={name}
          read-only={flag(!can(Operation.updateRole))}
          allow-delete={flag(can(Operation.deleteRole))}
        />
      </Allowed>
    </Page>
  );
}

/** Composing a new role from the catalog's permissions. */
export function NewRolePage() {
  const { apiBase } = useIam();
  const base = useBasePath();
  const history = useHistory();
  const editor = useIamElement<IamRoleEditorElement>({
    [IamEvent.roleSaved]: ({ detail }) => history.push(rolePath(base, detail.role.name)),
  });

  return (
    <Page title="New role" back={{ to: rolesPath(base), label: 'Roles' }}>
      <Allowed operation={Operation.createRole} refusal="You may not compose roles.">
        <RoleEditorElement ref={editor} api-base={apiBase} />
      </Allowed>
    </Page>
  );
}
