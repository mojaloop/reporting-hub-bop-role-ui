import { State } from 'store';
import buildApi, { buildEndpointBuilder, EndpointConfig } from '@modusbox/redux-utils/lib/api';
import usersMock from 'App/Users/_mockData';
import userProfileMock from 'App/UserProfile/_mockData';

const services = {
  reportingApi: {
    baseUrl: '',
    mock: () => true,
  },
};

const builder = buildEndpointBuilder<State>();

const users: EndpointConfig = {
  service: services.reportingApi,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  url: (_: State) => `/users`,
  mock: usersMock,
};

const userProfile: EndpointConfig = {
  service: services.reportingApi,
  url: (_: State, pathname: string) => `/userProfile${pathname}`,
  mock: userProfileMock,
};

export default buildApi({
  users: builder<{}>(users),
  userProfile: builder<{}>(userProfile),
});
