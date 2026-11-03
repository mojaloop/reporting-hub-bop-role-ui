import { afterEach, describe, expect, it, vi } from 'vitest';
import { runtimeConfig } from './config';

describe('runtimeConfig in production', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    window.roleEnv = undefined;
  });

  it('reads what the deployment gives', () => {
    vi.stubEnv('NODE_ENV', 'production');
    window.roleEnv = {
      REACT_APP_API_BASE_URL: 'https://iam-api.example/',
      REACT_APP_IAM_PERMISSION_PREFIX: 'iam',
    };
    expect(runtimeConfig()).toEqual({ apiBaseUrl: 'https://iam-api.example', iamService: 'iam' });
  });

  it('reads a key the deployment left out as not configured', () => {
    vi.stubEnv('NODE_ENV', 'production');
    window.roleEnv = { REACT_APP_API_BASE_URL: 'https://iam-api.example' };
    expect(runtimeConfig().iamService).toBe('');
  });

  it('reads no runtime-env.js at all as nothing configured', () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect(runtimeConfig()).toEqual({ apiBaseUrl: '', iamService: '' });
  });
});
