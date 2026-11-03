import React from 'react';
import { useHistory } from 'react-router-dom';
import { IamEvent, IamSubjectsElement } from '@mojaloop/authz-ui/elements';
import { useIam } from '../iam';
import { SubjectsElement, useIamElement } from './elements';
import { useBasePath } from './hooks';
import { Allowed, Page } from './Page';
import { subjectPath } from './paths';
import { Operation } from './permissions';

/** The people and machine clients that can hold roles. */
export default function Subjects() {
  const { apiBase } = useIam();
  const base = useBasePath();
  const history = useHistory();
  const subjects = useIamElement<IamSubjectsElement>({
    [IamEvent.subjectOpen]: ({ detail }) => history.push(subjectPath(base, detail.subject.id)),
  });

  return (
    <Page title="Users and clients">
      <Allowed operation={Operation.listSubjects} refusal="You may not list users and clients.">
        <SubjectsElement ref={subjects} api-base={apiBase} />
      </Allowed>
    </Page>
  );
}
