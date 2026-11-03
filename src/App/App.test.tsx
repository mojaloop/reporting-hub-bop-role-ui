import React from 'react';
import { createAuthzClient } from '@mojaloop/authz-ui/client';
import type { Assignment, Held, NewRole, Role } from '@mojaloop/authz-ui/client';
import { ElementTag } from '@mojaloop/authz-ui/elements';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Iam, IamProvider } from '../iam';
import App from './App';

const MOUNT = '/iam';
const SERVICE = 'iam';
const BASE = 'https://portal.test/iam-api';
const SESSION = 'https://portal.test/kratos/sessions/whoami';
const ALICE = 'alice-id';

const ALL_OPERATIONS = [
  'listSubjects',
  'getAssignments',
  'assignRole',
  'unassignRole',
  'listRoles',
  'getRole',
  'createRole',
  'updateRole',
  'deleteRole',
];
const READ_OPERATIONS = ['listSubjects', 'getAssignments', 'listRoles', 'getRole'];

const reader: Role = {
  name: 'reader',
  title: 'Reader',
  grants: [{ permission: 'ledger.listEntries' }],
  open: ['participant'],
  owner: 'deployment',
};
const signedInRole: Role = {
  name: 'signed-in',
  heldBy: 'authenticated',
  grants: [{ permission: 'iam.getChanges' }],
  open: [],
  owner: 'deployment',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

/** A change stream that stays open and never sends: nothing changes in these tests. */
class QuietStream extends EventTarget {
  close = (): void => undefined;
}

interface SignedIn extends Iam {
  /** How many times the app read the session. */
  sessionReads: () => number;
}

/**
 * A browser signed in as a caller holding `operations`, its session read from
 * the shell's endpoint, and the IAM's public API as a list of fixed answers.
 */
const signedIn = (operations: string[], service = SERVICE): SignedIn => {
  const roles: Role[] = [reader, signedInRole];
  const assignments: Record<string, Held[]> = { [ALICE]: [] };

  const answer = (method: string, path: string, query: URLSearchParams, body: unknown): unknown => {
    if (method === 'GET' && path === '/subjects') {
      return [
        { id: 'admin-id', kind: 'person', email: 'admin@example.test' },
        { id: ALICE, kind: 'person', email: 'alice@example.test' },
        { id: 'vic-id', kind: 'person', email: 'vic@example.test' },
      ];
    }
    const subject = /^\/subjects\/([^/]+)\/assignments$/.exec(path)?.[1];
    const assignment = body as Required<Assignment>;
    if (subject !== undefined && method === 'GET') return assignments[subject] ?? [];
    if (subject !== undefined && method === 'POST') {
      (assignments[subject] ??= []).push({ ...assignment, through: 'assigned' });
      return { instance: `${assignment.role}@participant=${assignment.resources.participant}` };
    }
    if (subject !== undefined && method === 'DELETE') {
      assignments[subject] = (assignments[subject] ?? []).filter(
        (held) =>
          held.role !== assignment.role ||
          held.resources.participant !== assignment.resources.participant,
      );
      return { instance: `${assignment.role}@participant=${assignment.resources.participant}` };
    }
    if (method === 'GET' && path === '/roles') return roles;
    if (method === 'POST' && path === '/roles') {
      const created: Role = { ...(body as NewRole), open: ['participant'], owner: 'iam' };
      roles.push(created);
      return created;
    }
    const role = /^\/roles\/([^/]+)$/.exec(path)?.[1];
    if (role !== undefined && method === 'GET') return roles.find((r) => r.name === role);
    if (method === 'GET' && path === '/catalog') {
      return [
        {
          service: 'ledger',
          title: 'Ledger',
          permissions: [
            {
              id: 'ledger.listEntries',
              operationId: 'listEntries',
              summary: 'Lists entries',
              method: 'GET',
              path: '/entries',
              deprecated: false,
              scopedBy: ['participants'],
              bound: [],
              resourceNames: { participants: 'participant' },
            },
          ],
        },
      ];
    }
    if (method === 'GET' && path === '/resource-names') {
      return {
        participant: {
          label: 'Participant',
          members: [{ service: 'ledger', type: 'participants' }],
        },
      };
    }
    if (method === 'GET' && path === '/resources') {
      const name = query.get('resourceName');
      return [
        { resourceName: 'participant', id: 'p1' },
        { resourceName: 'participant', id: 'p2' },
      ].filter((resource) => name === null || resource.resourceName === name);
    }
    return undefined;
  };

  const iamFetch = async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    const path = decodeURIComponent(url.pathname.slice(new URL(BASE).pathname.length));
    const text = await request.text();
    const found = answer(
      request.method,
      path,
      url.searchParams,
      text === '' ? undefined : JSON.parse(text),
    );
    return found === undefined
      ? json({ errors: [`no answer for ${request.method} ${path}`] }, 404)
      : json(found);
  };

  let reads = 0;
  const permissions = Object.fromEntries(
    operations.map((operation) => [`${SERVICE}.${operation}`, {}]),
  );
  vi.stubGlobal('fetch', async (url: string) => {
    if (url !== SESSION) return json({}, 404);
    reads += 1;
    return json({ identity: { metadata_public: { permissions } } });
  });

  const eventSource = QuietStream as unknown as typeof globalThis.EventSource;
  return {
    apiBase: BASE,
    service,
    session: SESSION,
    fetch: iamFetch,
    eventSource,
    client: createAuthzClient({ baseUrl: BASE, fetch: iamFetch, EventSource: eventSource }),
    sessionReads: () => reads,
  };
};

/** The app as the shell mounts it, below `/iam`, and where it routed to last. */
const mount = (iam: Iam, path: string) => {
  const at = { path };
  render(
    <MemoryRouter initialEntries={[path]}>
      <Route path={MOUNT}>
        <IamProvider iam={iam}>
          <App />
        </IamProvider>
      </Route>
      <Route
        path="*"
        render={({ location }) => {
          at.path = location.pathname;
          return null;
        }}
      />
    </MemoryRouter>,
  );
  return at;
};

/** What one of the IAM's elements shows, inside its shadow root, once it is on the page. */
const element = async (tag: ElementTag) => {
  const content = await waitFor(() => {
    const shown = document.querySelector(tag)?.shadowRoot?.querySelector('div');
    if (!shown?.hasChildNodes()) throw new Error(`no ${tag} on the page`);
    return shown;
  });
  return within(content);
};

/**
 * The button once the element has rendered what came before, since an element
 * renders a change after the event that made it, as a user would see it.
 */
const enabled = (button: HTMLElement) =>
  waitFor(() => {
    expect((button as HTMLButtonElement).disabled).toBe(false);
    return button;
  });

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('the role administration app', () => {
  it('lists users and clients, opens one at its own route, and gives it a role over the resource it leaves open', async () => {
    const admin = signedIn(ALL_OPERATIONS);
    const at = mount(admin, MOUNT);

    const subjects = await element(ElementTag.subjects);
    const row = (await subjects.findByText('alice@example.test')).closest('tr') as HTMLElement;
    fireEvent.click(within(row).getByRole('button'));
    await waitFor(() => expect(at.path).toBe(`${MOUNT}/subjects/${ALICE}`));
    expect(await screen.findByRole('heading', { name: 'alice@example.test' })).not.toBeNull();

    const editor = await element(ElementTag.assignmentEditor);
    fireEvent.change(await editor.findByLabelText('Role'), { target: { value: 'reader' } });
    fireEvent.change(await editor.findByLabelText('Participant'), { target: { value: 'p1' } });
    fireEvent.click(await enabled(editor.getByRole('button', { name: 'Assign' })));
    await waitFor(async () =>
      expect(await admin.client.getAssignments(ALICE)).toContainEqual({
        role: 'reader',
        resources: { participant: 'p1' },
        through: 'assigned',
      }),
    );
  });

  it('reads the session again once an element reports a change', async () => {
    const admin = signedIn(ALL_OPERATIONS);
    await admin.client.assignRole(ALICE, { role: 'reader', resources: { participant: 'p2' } });
    mount(admin, `${MOUNT}/subjects/${ALICE}`);
    const editor = await element(ElementTag.assignmentEditor);
    const held = (await editor.findByText('p2')).closest('li') as HTMLElement;
    const before = admin.sessionReads();
    fireEvent.click(within(held).getByRole('button', { name: 'Remove' }));
    await waitFor(() => expect(admin.sessionReads()).toBeGreaterThan(before));
  });

  it('composes a role from the catalog at the new-role route, then opens it at its own', async () => {
    const admin = signedIn(ALL_OPERATIONS);
    const at = mount(admin, `${MOUNT}/roles`);

    const roles = await element(ElementTag.roles);
    fireEvent.click(await roles.findByRole('button', { name: 'New role' }));
    await waitFor(() => expect(at.path).toBe(`${MOUNT}/roles/new`));
    const editor = await element(ElementTag.roleEditor);
    fireEvent.change(await editor.findByLabelText('Name'), { target: { value: 'entry-reader' } });
    fireEvent.change(editor.getByLabelText('Permission'), {
      target: { value: 'ledger.listEntries' },
    });
    fireEvent.click(await enabled(editor.getByRole('button', { name: 'Add grant' })));
    fireEvent.click(await enabled(editor.getByRole('button', { name: 'Create role' })));

    await waitFor(() => expect(at.path).toBe(`${MOUNT}/roles/entry-reader`));
    expect(await screen.findByRole('heading', { name: 'entry-reader' })).not.toBeNull();
    expect(await admin.client.getRole('entry-reader')).toMatchObject({
      owner: 'iam',
      open: ['participant'],
    });
  });

  it('offers a caller who may only read neither changes to holdings nor roles to compose', async () => {
    const viewer = signedIn(READ_OPERATIONS);
    mount(viewer, `${MOUNT}/subjects/${ALICE}`);
    const editor = await element(ElementTag.assignmentEditor);
    expect(await editor.findByRole('heading', { name: 'Holds' })).not.toBeNull();
    expect(editor.queryByLabelText('Role')).toBeNull();
    expect(editor.queryByRole('button', { name: 'Remove' })).toBeNull();
  });

  it('shows the roles to a reader as views, without composing new ones', async () => {
    const viewer = signedIn(READ_OPERATIONS);
    mount(viewer, `${MOUNT}/roles`);
    const roles = await element(ElementTag.roles);
    const role = (await roles.findByText('Reader')).closest('li') as HTMLElement;
    expect(within(role).getByRole('button', { name: 'View' })).not.toBeNull();
    expect(roles.queryByRole('button', { name: 'New role' })).toBeNull();
  });

  it('refuses to guess the permission prefix the deployment did not give', async () => {
    const admin = signedIn(ALL_OPERATIONS, '');
    mount(admin, MOUNT);
    expect(screen.getByText(/REACT_APP_IAM_PERMISSION_PREFIX is not configured/)).not.toBeNull();
  });
});
