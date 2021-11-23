 /**************************************************************************
 *  (C) Copyright ModusBox Inc. 2020 - All rights reserved.               *
 *                                                                        *
 *  This file is made available under the terms of the license agreement  *
 *  specified in the corresponding source code repository.                *
 *                                                                        *
 *  ORIGINAL AUTHOR:                                                      *
 *       Sridevi Miriyala - sridevi.miriyala@modusbox.com                   *
 **************************************************************************/

import * as dotenv from 'dotenv';
import * as assert from 'assert';
import users from '../../manifests/backend/users.json'

dotenv.config();

function ensureEnv(e: string): string {
  const result = process.env[e];
  assert.notStrictEqual(typeof result, 'undefined', `Required ${e} to be set in the environment`);
  return result as string;
}

// TODO: ajv
export const config = {
  roleMicrofrontendEndpoint: ensureEnv('ROLE_MICROFRONTEND_ENDPOINT'),
  credentials: {
    admin: {
      username: users[0].username,
      password: users[0].password,
    },
    user: {
      username: users[1].username,
      password: users[1].password,
    },
  },
  voodooTimeoutMs: 30000,
};
