import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { MessageBox } from 'components';
import { useIam } from '../iam';
import { BasePathProvider, useMountPath } from './hooks';
import { newRolePath, RouteParam, rolesPath, subjectsPath } from './paths';
import { PermissionsProvider } from './permissions';
import { NewRolePage, RolePage } from './RolePage';
import Roles from './Roles';
import SubjectPage from './SubjectPage';
import Subjects from './Subjects';

const APP = 'user-iam-app';

/** The role administration screens, at whatever path the app is mounted. */
function App() {
  const basePath = useMountPath();
  const { service } = useIam();
  if (service === '') {
    return (
      <div className={APP}>
        <MessageBox kind="danger">
          REACT_APP_IAM_SERVICE is not configured: the IAM&apos;s permission prefix is unknown.
        </MessageBox>
      </div>
    );
  }
  return (
    <BasePathProvider value={basePath}>
      <PermissionsProvider className={APP}>
        <Switch>
          <Route exact path={`${basePath}/`}>
            <Redirect to={subjectsPath(basePath)} />
          </Route>
          <Route exact path={subjectsPath(basePath)} component={Subjects} />
          <Route
            path={`${subjectsPath(basePath)}/:${RouteParam.subject}`}
            component={SubjectPage}
          />
          <Route exact path={rolesPath(basePath)} component={Roles} />
          <Route exact path={newRolePath(basePath)} component={NewRolePage} />
          <Route path={`${rolesPath(basePath)}/:${RouteParam.role}`} component={RolePage} />
        </Switch>
      </PermissionsProvider>
    </BasePathProvider>
  );
}

export { App };
export default App;
