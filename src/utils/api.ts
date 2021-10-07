import { State } from 'store';
import buildApi, { buildEndpointBuilder, EndpointConfig } from '@modusbox/redux-utils/lib/api';

let baseUrl: string;
let mockApi: string;
if (process.env.NODE_ENV === 'production') {
  baseUrl = window.env.REACT_APP_API_BASE_URL;
  mockApi = window.env.REACT_APP_MOCK_API;
} else if (process.env.REACT_APP_API_BASE_URL && process.env.REACT_APP_REMOTE_MOCK_API) {
  baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/\/$/, '');
  mockApi = process.env.REACT_APP_REMOTE_MOCK_API;
} else {
  baseUrl = '';
  mockApi = 'true';
}

const services = {
  rolesApi: {
    baseUrl,
    mock: () => mockApi === 'true',
  },
};

const builder = buildEndpointBuilder<State>();

const users: EndpointConfig = {
  service: services.rolesApi,
  url: () => `/users`,
};

const usersId: EndpointConfig = {
  service: services.rolesApi,
  url: (_: State, id: string) => `/users/${id}`,
};

const roles: EndpointConfig = {
  service: services.rolesApi,
  url: () => `/roles`,
};

const participants: EndpointConfig = {
  service: services.rolesApi,
  url: () => `/participants`,
};

const userRoles: EndpointConfig = {
  service: services.rolesApi,
  url: (_: State, { id }) => `/users/${id}/roles`,
};

const userParticipants: EndpointConfig = {
  service: services.rolesApi,
  url: (_: State, { id }) => `/users/${id}/participants`,
};

export default buildApi({
  users: builder<{}>(users),
  usersId: builder<{}>(usersId),
  roles: builder<{}>(roles),
  participants: builder<{}>(participants),
  userRoles: builder<{}>(userRoles),
  userParticipants: builder<{}>(userParticipants),
});
