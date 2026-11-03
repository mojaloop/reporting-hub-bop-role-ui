import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IamEvent } from '@mojaloop/authz-ui/elements';
import { useIam } from '../iam';

/** The IAM operations this app offers, by their operationId. */
export const Operation = {
  listSubjects: 'listSubjects',
  getAssignments: 'getAssignments',
  assignRole: 'assignRole',
  unassignRole: 'unassignRole',
  listRoles: 'listRoles',
  getRole: 'getRole',
  createRole: 'createRole',
  updateRole: 'updateRole',
  deleteRole: 'deleteRole',
} as const;
export type OperationId = typeof Operation[keyof typeof Operation];

/** How the IAM names an operation's permission: `<the prefix the deployment gives it>.<operationId>`. */
const PERMISSION_SEPARATOR = '.';
const permissionOf = (service: string, operation: OperationId): string =>
  `${service}${PERMISSION_SEPARATOR}${operation}`;

/** What an element reports that can change what the caller holds. */
const CHANGES = [IamEvent.roleSaved, IamEvent.roleDeleted, IamEvent.assignmentChanged];

interface Session {
  identity?: { metadata_public?: { permissions?: Record<string, unknown> } };
}

/** The ids of the permissions the session holds. */
async function heldIn(session: string, signal: AbortSignal): Promise<string[]> {
  const response = await fetch(session, { credentials: 'include', signal });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const body: Session = await response.json();
  return Object.keys(body.identity?.metadata_public?.permissions ?? {});
}

export interface Permissions {
  pending: boolean;
  error?: Error;
  /** Whether the caller holds the operation; false until the IAM has answered. */
  can(operation: OperationId): boolean;
}

const PermissionsContext = createContext<Permissions | undefined>(undefined);

export function usePermissions(): Permissions {
  const permissions = useContext(PermissionsContext);
  if (permissions === undefined) {
    throw new Error('usePermissions is used outside <PermissionsProvider>');
  }
  return permissions;
}

interface PermissionsProviderProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Which of the operations the caller holds, read from the session the shell
 * signed in with, and read again whenever an element inside reports a change
 * or the IAM's change stream reports one.
 */
export function PermissionsProvider({ className, children }: PermissionsProviderProps) {
  const iam = useIam();
  const root = useRef<HTMLDivElement>(null);
  const [reads, setReads] = useState(0);
  const [answer, setAnswer] = useState<{ held?: string[]; error?: Error }>({});

  const asked = useMemo(
    () =>
      new Map(
        Object.values(Operation).map((operation) => [
          permissionOf(iam.service, operation),
          operation,
        ]),
      ),
    [iam.service],
  );

  useEffect(() => {
    if (iam.session === undefined) {
      setAnswer({ held: [] });
      return undefined;
    }
    const abort = new AbortController();
    heldIn(iam.session, abort.signal).then(
      (held) => setAnswer({ held }),
      (error: Error) => {
        if (!abort.signal.aborted) setAnswer({ error });
      },
    );
    return () => abort.abort();
  }, [iam, reads]);

  useEffect(() => {
    const element = root.current;
    if (element === null) return undefined;
    const reread = () => setReads((count) => count + 1);
    CHANGES.forEach((type) => element.addEventListener(type, reread));
    const close = iam.client.watchChanges({ onChange: reread });
    return () => {
      CHANGES.forEach((type) => element.removeEventListener(type, reread));
      close();
    };
  }, [iam]);

  const permissions = useMemo((): Permissions => {
    const holds = new Set((answer.held ?? []).map((id) => asked.get(id)));
    return {
      pending: answer.held === undefined && answer.error === undefined,
      error: answer.error,
      can: (operation) => holds.has(operation),
    };
  }, [answer, asked]);

  return (
    <div ref={root} className={className}>
      <PermissionsContext.Provider value={permissions}>{children}</PermissionsContext.Provider>
    </div>
  );
}
