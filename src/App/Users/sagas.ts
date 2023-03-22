import { MakeResponse } from '@modusbox/redux-utils/lib/api';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import api from 'utils/api';
import { strict as assert } from 'assert';
import { actions } from './slice';
import { FetchUsersResponse, User } from './types';

function* fetchUsers() {
  try {
    const response = (yield call(api.users.read)) as MakeResponse<FetchUsersResponse>;

    assert(response.status !== 403, `Failed to fetch users - ${response.data.error.message}`);
    if (response.status !== 200) {
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
