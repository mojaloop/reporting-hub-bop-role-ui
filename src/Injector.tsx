import React from 'react';
import './App/index.scss';
import App from './App';
import { deployedIam, IamProvider } from './iam';

interface ExportAppProps {
  authConfig?: { authTokenEndpoint: string };
}

/** What the portal shell mounts, inside its router, at the path it gives the app. */
export default function ExportApp({ authConfig }: ExportAppProps) {
  return (
    <IamProvider iam={deployedIam(authConfig?.authTokenEndpoint)}>
      <App />
    </IamProvider>
  );
}

if (process.env.NODE_ENV !== 'development') {
  // eslint-disable-next-line
  console.info('Name', process.env.REACT_APP_NAME);

  // eslint-disable-next-line
  console.info('Version', process.env.REACT_APP_VERSION);

  // eslint-disable-next-line
  console.info('Commit', process.env.REACT_APP_COMMIT);
}
