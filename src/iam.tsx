import React, { createContext, ReactNode, useContext } from 'react';
import { AuthzClient, createAuthzClient } from '@mojaloop/authz-ui/client';
import type { Fetch } from '@mojaloop/authz-ui/elements';
import { runtimeConfig } from './config';

export interface Iam {
  /** Where the gateway serves the IAM's public API. */
  apiBase: string;
  /** The prefix the deployment gives the IAM, which its permission ids start with. */
  service: string;
  client: AuthzClient;
  /** What reaches the IAM, for the app and its elements alike; the browser's own when absent. */
  fetch?: Fetch;
  eventSource?: typeof EventSource;
  /** Where the shell reads the signed-in person's session. */
  session?: string;
}

const IamContext = createContext<Iam | undefined>(undefined);

export function useIam(): Iam {
  const iam = useContext(IamContext);
  if (iam === undefined) throw new Error('useIam is used outside <IamProvider>');
  return iam;
}

let deployed: Iam | undefined;

/** The IAM this deployment configures, made once per page so the app and its menu share it. */
export function deployedIam(session?: string): Iam {
  if (deployed === undefined) {
    const config = runtimeConfig();
    deployed = {
      apiBase: config.apiBaseUrl,
      service: config.iamService,
      client: createAuthzClient({ baseUrl: config.apiBaseUrl }),
      session,
    };
  }
  return deployed;
}

export function IamProvider({ iam, children }: { iam: Iam; children?: ReactNode }) {
  return <IamContext.Provider value={iam}>{children}</IamContext.Provider>;
}
