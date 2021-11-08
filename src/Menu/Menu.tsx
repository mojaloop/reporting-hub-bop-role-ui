import React from 'react';
import { Provider } from 'react-redux';
import { store, ReduxContext } from 'store';
import { Menu } from 'components';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';

interface ExportMenuProps {
  path: string;
  pathname: string;
  onChange: (path: string) => void;
}

interface MenuItemsProps {
  path: string;
}

function MenuItems({ path }: MenuItemsProps) {
  return (
    <>
      <Menu.Item path={`${path}`} label="Users" />
    </>
  );
}

// ExportMenu is the exported component to be consumed
// The shell passes down these props
export default function ExportMenu({ path, pathname, onChange }: ExportMenuProps) {
  return (
    <Menu path={path} pathname={pathname} onChange={onChange}>
      <Provider store={store} context={ReduxContext}>
        <MenuItems path={path} />
      </Provider>
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
