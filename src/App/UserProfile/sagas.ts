import api from 'utils/api';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { actions } from './slice';
import { UserProfile } from './types';

function* fetchUserProfile(action: PayloadAction<string>) {
  try {
    // @ts-ignore
    const response = yield call(api.userProfile.read, action.payload);

    if (response.status !== 200) {
      throw new Error(response.data);
    }

    // project result into our Transfer type
    const res: UserProfile = response.data;

    yield put(actions.setUserProfile(res));
  } catch (e) {
    yield put(actions.setUserProfileError(e.message));
  }
}

export function* FetchUserProfileSaga(): Generator {
  yield takeLatest(actions.requestUserProfile.type, fetchUserProfile);
}

export default function* rootSaga(): Generator {
  yield all([FetchUserProfileSaga()]);
}
