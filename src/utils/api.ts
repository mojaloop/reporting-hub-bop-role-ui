import { State } from 'store';
import buildApi, { buildEndpointBuilder, EndpointConfig } from '@modusbox/redux-utils/lib/api';

const services = {
  rolesApi: {
    baseUrl: process.env.ROLE_API_URL ? process.env.ROLE_API_URL.replace(/\/$/, '') : '',
    mock: () => false,
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
