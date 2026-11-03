import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IamAssignmentEditorElement } from '@mojaloop/authz-ui/elements';
import { useIam } from '../iam';
import { AssignmentEditorElement, flag, useIamElement } from './elements';
import { useBasePath } from './hooks';
import { Allowed, Page } from './Page';
import { RouteParam, subjectsPath } from './paths';
import { Operation, usePermissions } from './permissions';

/** How the subject reads: its name, else its email, else its id. */
function useSubjectName(subject: string): string {
  const { client } = useIam();
  const { can } = usePermissions();
  const listable = can(Operation.listSubjects);
  const [name, setName] = useState<string>();

  useEffect(() => {
    if (!listable) return undefined;
    const abort = new AbortController();
    client.listSubjects({ signal: abort.signal }).then(
      (subjects) => {
        const found = subjects.find((candidate) => candidate.id === subject);
        setName(found?.name ?? found?.email);
      },
      () => undefined,
    );
    return () => abort.abort();
  }, [client, listable, subject]);

  return name ?? subject;
}

/** What one person or machine client holds, and changing it. */
export default function SubjectPage() {
  const { [RouteParam.subject]: subject } = useParams<Record<typeof RouteParam.subject, string>>();
  const { apiBase } = useIam();
  const { can } = usePermissions();
  const base = useBasePath();
  const title = useSubjectName(subject);
  const editor = useIamElement<IamAssignmentEditorElement>({});

  return (
    <Page title={title} back={{ to: subjectsPath(base), label: 'Users and clients' }}>
      <Allowed
        operation={Operation.getAssignments}
        refusal="You may not see what this subject holds."
      >
        <AssignmentEditorElement
          ref={editor}
          api-base={apiBase}
          subject={subject}
          can-assign={flag(can(Operation.assignRole) && can(Operation.listRoles))}
          can-unassign={flag(can(Operation.unassignRole))}
        />
      </Allowed>
    </Page>
  );
}
