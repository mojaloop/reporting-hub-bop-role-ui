export interface RuntimeConfig {
  /** Where the gateway serves the IAM's public API. */
  apiBaseUrl: string;
  /** The prefix the deployment gives the IAM, which its permission ids start with. */
  iamService: string;
}

export function runtimeConfig(): RuntimeConfig {
  const env: Window['roleEnv'] =
    process.env.NODE_ENV === 'production'
      ? window.roleEnv
      : {
          REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
          REACT_APP_IAM_PERMISSION_PREFIX: process.env.REACT_APP_IAM_PERMISSION_PREFIX,
        };
  return {
    apiBaseUrl: (env?.REACT_APP_API_BASE_URL ?? '').replace(/\/$/, ''),
    iamService: env?.REACT_APP_IAM_PERMISSION_PREFIX ?? '',
  };
}
