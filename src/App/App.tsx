import React from 'react';
import './index.scss';
import { Switch, Route } from 'react-router-dom';
import Users from './Users';
import UserProfile from './UserProfile';
import { useBasePath } from './hooks';

function App() {
  const basePath = useBasePath();
  return (
    <div className="user-iam-app">
      <Switch>
        <Route exact path={`${basePath}/`} component={Users} />
        <Route path={`${basePath}/:id`} component={UserProfile} />
      </Switch>
    </div>
  );
}

export { App };
export default App;
