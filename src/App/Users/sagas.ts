import api from 'utils/api';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { User } from './types';
import { actions } from './slice';

function* fetchUsers() {
  try {
    // @ts-ignore
    const response = yield call(api.users.read);

    if (response.status !== 200) {
      throw new Error(response.data);
    }

    // project result into our Transfer type
    const res: User[] = response.data;

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
