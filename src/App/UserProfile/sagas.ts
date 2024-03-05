import api from 'utils/api';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { MakeResponse } from '@modusbox/redux-utils/lib/api';
import { actions } from './slice';
import {
  FetchUserByIdResponse,
  UserProfile,
  RolesDelta,
  RoleRow,
  ParticipantsDelta,
  ParticipantRow,
  RoleDeletionItem,
  ParticipantDeletionItem,
  FetchRolesResponse,
  FetchParticipantsResponse,
} from './types';

function* fetchUserProfile(action: PayloadAction<string>) {
  try {
    const userProfile: UserProfile = {
      id: '',
      username: '',
      assignedRoles: [],
      assignableRoles: [],
      assignedParticipants: [],
      assignableParticipants: [],
    };

    const userResponse = (yield call(
      api.usersId.read,
      action.payload,
    )) as MakeResponse<FetchUserByIdResponse>;
    if (userResponse.status !== 200) {
      throw new Error(JSON.stringify(userResponse));
    }
    userProfile.id = userResponse.data.user.id;
    userProfile.username = userResponse.data.user.username;

    const assignableRolesResponse = (yield call(
      api.roles.read,
      action.payload,
    )) as MakeResponse<FetchRolesResponse>;
    if (assignableRolesResponse.status !== 200) {
      throw new Error(JSON.stringify(assignableRolesResponse));
    }
    userProfile.assignableRoles = assignableRolesResponse.data.roles;

    const assignedRolesResponse = (yield call(api.userRoles.read, {
      id: action.payload,
    })) as MakeResponse<FetchRolesResponse>;
    if (assignedRolesResponse.status !== 200) {
      throw new Error(JSON.stringify(assignedRolesResponse));
    }
    userProfile.assignedRoles = assignedRolesResponse.data.roles;

    const assignableParticipantsResponse = (yield call(
      api.participants.read,
    )) as MakeResponse<FetchParticipantsResponse>;

    if (assignableParticipantsResponse.status == 200) {
      // throw new Error(JSON.stringify(assignableParticipantsResponse));
      userProfile.assignableParticipants = assignableParticipantsResponse.data.participants;
  
      const assignedParticipantsResponse = (yield call(api.userParticipants.read, {
        id: action.payload,
      })) as MakeResponse<FetchParticipantsResponse>;
  
      if (assignedParticipantsResponse.status !== 200) {
        throw new Error(JSON.stringify(assignedParticipantsResponse));
      }
      userProfile.assignedParticipants = assignedParticipantsResponse.data.participants;
    }

    yield put(actions.setUserProfile(userProfile));
  } catch (e) {
    yield put(actions.setUserProfileError(e.message));
  }
}

function* updateUserRoles(action: PayloadAction<RolesDelta>) {
  const roleDeletion = action.payload.requestDeletionRows.map((roleRow: RoleRow) => {
    return {
      action: 'delete',
      roleId: roleRow.role,
    };
  });
  const roleAssignment = action.payload.requestAssignmentRows.map((roleRow: RoleRow) => {
    return {
      action: 'insert',
      roleId: roleRow.role,
    };
  });
  const roleDelta = roleAssignment.concat(roleDeletion);
  const requestBody = {
    id: action.payload.id,
    body: {
      roleOperations: roleDelta,
    },
  };
  try {
    const userResponse = (yield call(api.userRoles.modify, requestBody)) as MakeResponse<null>;
    if (userResponse.status !== 200) {
      throw new Error(JSON.stringify(userResponse));
    }

    const assignedRolesResponse = (yield call(api.userRoles.read, {
      id: action.payload.id,
    })) as MakeResponse<FetchRolesResponse>;
    if (assignedRolesResponse.status !== 200) {
      throw new Error(JSON.stringify(assignedRolesResponse));
    }
    yield put(actions.setUserProfileRoles(assignedRolesResponse.data.roles));
  } catch (e) {
    yield put(actions.setUserProfileRolesError(e.message));
  }
}

function* updateUserParticipants(action: PayloadAction<ParticipantsDelta>) {
  const participantDeletion = action.payload.requestDeletionRows.map(
    (participantRow: ParticipantRow) => {
      return {
        action: 'delete',
        participantId: participantRow.participant,
      };
    },
  );
  const participantAssignment = action.payload.requestAssignmentRows.map(
    (participantRow: ParticipantRow) => {
      return {
        action: 'insert',
        participantId: participantRow.participant,
      };
    },
  );
  const participantDelta = participantAssignment.concat(participantDeletion);
  const requestBody = {
    id: action.payload.id,
    body: {
      participantOperations: participantDelta,
    },
  };

  const userResponse = (yield call(api.userParticipants.modify, requestBody)) as MakeResponse<null>;
  if (userResponse.status !== 200) {
    throw new Error(JSON.stringify(userResponse));
  }

  const assignedParticipantsResponse = (yield call(api.userParticipants.read, {
    id: action.payload.id,
  })) as MakeResponse<FetchParticipantsResponse>;
  if (assignedParticipantsResponse.status !== 200) {
    throw new Error(JSON.stringify(assignedParticipantsResponse));
  }
  yield put(actions.setUserProfileParticipants(assignedParticipantsResponse.data.participants));
}

function* deleteRole(action: PayloadAction<RoleDeletionItem>) {
  const requestBody = {
    id: action.payload.id,
    body: {
      roleOperations: [
        {
          action: 'delete',
          roleId: action.payload.roleId,
        },
      ],
    },
  };

  const userResponse = (yield call(api.userRoles.modify, requestBody)) as MakeResponse<null>;
  if (userResponse.status !== 200) {
    throw new Error(JSON.stringify(userResponse));
  }

  const assignedRolesResponse = (yield call(api.userRoles.read, {
    id: action.payload.id,
  })) as MakeResponse<FetchRolesResponse>;
  if (assignedRolesResponse.status !== 200) {
    throw new Error(JSON.stringify(assignedRolesResponse));
  }
  yield put(actions.setUserProfileRoles(assignedRolesResponse.data.roles));
}

function* deleteParticipant(action: PayloadAction<ParticipantDeletionItem>) {
  const requestBody = {
    id: action.payload.id,
    body: {
      participantOperations: [
        {
          action: 'delete',
          participantId: action.payload.participantId,
        },
      ],
    },
  };

  const userResponse = (yield call(api.userParticipants.modify, requestBody)) as MakeResponse<null>;
  if (userResponse.status !== 200) {
    throw new Error(JSON.stringify(userResponse.data));
  }

  const assignedParticipantsResponse = (yield call(api.userParticipants.read, {
    id: action.payload.id,
  })) as MakeResponse<FetchParticipantsResponse>;
  if (assignedParticipantsResponse.status !== 200) {
    throw new Error(JSON.stringify(assignedParticipantsResponse));
  }
  yield put(actions.setUserProfileParticipants(assignedParticipantsResponse.data.participants));
}

export function* FetchUserProfileSaga(): Generator {
  yield takeLatest(actions.requestUserProfile.type, fetchUserProfile);
}

export function* UpdateUserRolesSaga(): Generator {
  yield takeLatest(actions.requestUserProfileRolesUpdate.type, updateUserRoles);
}

export function* UpdateUserParticipantsSaga(): Generator {
  yield takeLatest(actions.requestUserProfileParticipantsUpdate.type, updateUserParticipants);
}

export function* DeleteUserRoleSaga(): Generator {
  yield takeLatest(actions.requestUserProfileRoleRemove.type, deleteRole);
}

export function* DeleteParticipantRoleSaga(): Generator {
  yield takeLatest(actions.requestUserProfileParticipantRemove.type, deleteParticipant);
}

export default function* rootSaga(): Generator {
  yield all([
    FetchUserProfileSaga(),
    UpdateUserRolesSaga(),
    UpdateUserParticipantsSaga(),
    DeleteUserRoleSaga(),
    DeleteParticipantRoleSaga(),
  ]);
}
