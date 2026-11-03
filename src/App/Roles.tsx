import React from 'react';
import { useHistory } from 'react-router-dom';
import { IamEvent, IamRolesElement } from '@mojaloop/authz-ui/elements';
import { useIam } from '../iam';
import { flag, RolesElement, useIamElement } from './elements';
import { useBasePath } from './hooks';
import { Allowed, Page } from './Page';
import { newRolePath, rolePath } from './paths';
import { Operation, usePermissions } from './permissions';

/** Every role, composing new ones and opening one to change or read it. */
export default function Roles() {
  const { apiBase } = useIam();
  const { can } = usePermissions();
  const base = useBasePath();
  const history = useHistory();
  const roles = useIamElement<IamRolesElement>({
    [IamEvent.roleOpen]: ({ detail }) =>
      history.push(
        detail.roleName === undefined ? newRolePath(base) : rolePath(base, detail.roleName),
      ),
  });

  return (
    <Page title="Roles">
      <Allowed operation={Operation.listRoles} refusal="You may not list roles.">
        <RolesElement
          ref={roles}
          api-base={apiBase}
          read-only={flag(!can(Operation.updateRole))}
          allow-create={flag(can(Operation.createRole))}
          allow-open={flag(can(Operation.getRole))}
        />
      </Allowed>
    </Page>
  );
}
