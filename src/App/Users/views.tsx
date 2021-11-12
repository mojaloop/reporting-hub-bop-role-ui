import React from 'react';
import { MessageBox, Spinner, Heading, Table } from 'components';
import { useHistory } from 'react-router-dom';
import { useBasePath } from 'App/hooks';
import './Users.scss';
import { Name, User } from './types';
import usersConnector, { UsersProps } from './connectors';

const usersColumns = [
  {
    label: 'Username',
    key: 'username',
  },
  {
    label: 'Name',
    key: 'name',
    fn: (rawValue: Name) => {
      return `${rawValue ? rawValue.givenName : ''} ${rawValue ? rawValue.familyName : ''}`;
    },
  },
  {
    label: 'Emails',
    key: 'emails',
    fn: (rawValue: string[]) => {
      if (rawValue) {
        return rawValue.join(',');
      }
      return '-';
    },
  },
];

function Users({ users, usersError, isUsersRequestPending, onPageMount }: UsersProps) {
  // @ts-ignore
  React.useEffect(() => onPageMount(), []);

  const history = useHistory();
  const basePath = useBasePath();
  const handleRoute = (user: User) => {
    history.push(`${basePath}${user.id}`);
  };

  let content = null;
  if (usersError) {
    content = <MessageBox kind="danger">Error fetching users: {usersError}</MessageBox>;
  } else if (isUsersRequestPending) {
    content = <Spinner center />;
  } else {
    content = (
      <Table
        columns={usersColumns}
        rows={users}
        onSelect={handleRoute}
        flexible
        pageSize={10}
        paginatorSize={7}
      />
    );
  }

  return (
    <div>
      <Heading size="3">Users</Heading>
      {content}
    </div>
  );
}

export default usersConnector(Users);
