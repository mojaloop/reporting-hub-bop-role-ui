import { MakeResponse } from '@modusbox/redux-utils/lib/api';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import api from 'utils/api';
import { actions } from './slice';
import { FetchUsersResponse, User } from './types';

function* fetchUsers() {
  try {
    const response = (yield call(api.users.read)) as MakeResponse<FetchUsersResponse>;

    if (response && response.status !== 200) {
      if (response.data?.error?.message) {
        throw new Error(JSON.stringify(response.data?.error?.message));
      }
      throw new Error(JSON.stringify(response));
    }
    const res: User[] = response.data.users;

    yield put(actions.setUsers(res));
  } catch (e) {
    yield put(actions.setUsersError(e.message));
  }
}

export function* FetchUsersSaga(): Generator {
  yield takeLatest(actions.requestUsers.type, fetchUsers);
}

export default function* rootSaga(): Generator {
  yield all([FetchUsersSaga()]);
}
