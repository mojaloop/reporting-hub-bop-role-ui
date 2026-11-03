import React from 'react';
import { Menu } from 'components';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { rolesPath, subjectsPath } from '../App/paths';

interface ExportMenuProps {
  path: string;
  pathname: string;
  onChange: (path: string) => void;
}

// ExportMenu is the exported component to be consumed
// The shell passes down these props
export default function ExportMenu({ path, pathname, onChange }: ExportMenuProps) {
  return (
    <Menu path={path} pathname={pathname} onChange={onChange}>
      <Menu.Item path={subjectsPath(path)} label="Users and clients" partial />
      <Menu.Item path={rolesPath(path)} label="Roles" partial />
    </Menu>
  );
}

// AppMenu is the standalone component used when the microfrontend is not being
// consumed
export function AppMenu() {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const path = match.url === '/' ? '' : match.url;
  return <ExportMenu path={path} pathname={location.pathname} onChange={history.push} />;
}
