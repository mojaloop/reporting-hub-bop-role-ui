import React from 'react';
import { Provider } from 'react-redux';
import { store, ReduxContext } from 'store';
import { Menu } from 'components';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

interface ExportMenuProps {
  path: string;
}

function MenuItems({ path }: ExportMenuProps) {
  return (
    <>
      <Menu.Item path={`${path}`} label="Users" />
    </>
  );
}

export default function ExportMenu({ path }: ExportMenuProps) {
  return (
    <Provider store={store} context={ReduxContext}>
      <MenuItems path={path} />
    </Provider>
  );
}

export function AppMenu() {
  const match = useRouteMatch();
  const history = useHistory();
  const location = useLocation();
  const path = match.url === '/' ? '' : match.url;
  return (
    <Menu path={path} pathname={location.pathname} onChange={history.push}>
      <ExportMenu path={path} />
    </Menu>
  );
}
