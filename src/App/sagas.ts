import { all } from 'redux-saga/effects';
import usersSagas from './Users/sagas';
import userProfileSagas from './UserProfile/sagas';

function* rootSaga(): Generator {
  yield all([usersSagas(), userProfileSagas()]);
}

export default rootSaga;
