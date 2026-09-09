import api from 'utils/api';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { MakeResponse } from '@modusbox/redux-utils/lib/api';
import { actions } from './slice';
import {
  AssignmentChange,
  FetchAssignmentsResponse,
  FetchResourcesResponse,
  FetchRolesResponse,
  FetchUserByIdResponse,
  Role,
  UserProfile,
} from './types';

/**
 * Everything the page needs to show what someone holds and to offer a change:
 * the person, the roles a deployment defined, and the resources each role's
 * arguments are chosen from.
 */
function* fetchUserProfile(action: PayloadAction<string>) {
  try {
    const userResponse = (yield call(
      api.usersId.read,
      action.payload,
    )) as MakeResponse<FetchUserByIdResponse>;
    if (userResponse.status !== 200) {
      throw new Error(JSON.stringify(userResponse));
    }

    const rolesResponse = (yield call(api.roles.read)) as MakeResponse<FetchRolesResponse>;
    if (rolesResponse.status !== 200) {
      throw new Error(JSON.stringify(rolesResponse));
    }
    const assignableRoles = rolesResponse.data.roles;

    const resourceNames = [...new Set(assignableRoles.flatMap((role: Role) => role.open))];
    const fetched = (yield all(
      resourceNames.map((resourceName) => call(api.resources.read, { resourceName })),
    )) as MakeResponse<FetchResourcesResponse>[];
    const resources: Record<string, string[]> = {};
    resourceNames.forEach((resourceName, index) => {
      const response = fetched[index];
      if (response.status !== 200) {
        throw new Error(JSON.stringify(response));
      }
      resources[resourceName] = response.data.resources.map((resource) => resource.id);
    });

    const assignmentsResponse = (yield call(api.userAssignments.read, {
      id: action.payload,
    })) as MakeResponse<FetchAssignmentsResponse>;
    if (assignmentsResponse.status !== 200) {
      throw new Error(JSON.stringify(assignmentsResponse));
    }

    const userProfile: UserProfile = {
      id: userResponse.data.user.id,
      username: userResponse.data.user.username,
      assignments: assignmentsResponse.data.assignments,
      assignableRoles,
      resources,
    };
    yield put(actions.setUserProfile(userProfile));
  } catch (e) {
    yield put(actions.setUserProfileError((e as Error).message));
  }
}

/**
 * One membership at a time, because that is what a change is: a role over
 * named resources, granted or taken back. The IAM refuses what it will not
 * write, and that refusal is what the page shows.
 */
function* changeAssignment(
  action: PayloadAction<AssignmentChange>,
  actionName: 'insert' | 'delete',
) {
  const { id, assignment } = action.payload;
  try {
    const response = (yield call(api.userAssignments.update, {
      id,
      body: {
        assignmentOperations: [
          { action: actionName, role: assignment.role, resources: assignment.resources },
        ],
      },
    })) as MakeResponse<{ errors?: string[] }>;
    if (response.status !== 200) {
      throw new Error((response.data?.errors ?? [JSON.stringify(response)]).join('; '));
    }

    const assignments = (yield call(api.userAssignments.read, {
      id,
    })) as MakeResponse<FetchAssignmentsResponse>;
    if (assignments.status !== 200) {
      throw new Error(JSON.stringify(assignments));
    }
    yield put(actions.setUserProfileAssignments(assignments.data.assignments));
  } catch (e) {
    yield put(actions.setUserProfileAssignmentsError((e as Error).message));
  }
}

function* addAssignment(action: PayloadAction<AssignmentChange>) {
  yield call(changeAssignment, action, 'insert');
}

function* removeAssignment(action: PayloadAction<AssignmentChange>) {
  yield call(changeAssignment, action, 'delete');
}

export function* FetchUserProfileSaga(): Generator {
  yield takeLatest(actions.requestUserProfile.type, fetchUserProfile);
}

export function* AddAssignmentSaga(): Generator {
  yield takeLatest(actions.requestAssignmentAdd.type, addAssignment);
}

export function* RemoveAssignmentSaga(): Generator {
  yield takeLatest(actions.requestAssignmentRemove.type, removeAssignment);
}

export default function* rootSaga(): Generator {
  yield all([FetchUserProfileSaga(), AddAssignmentSaga(), RemoveAssignmentSaga()]);
}
