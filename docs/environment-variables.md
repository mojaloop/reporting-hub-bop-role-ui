## Environment Variables

The application is driven by some environment variables used at build and runtime.


### Always Available Environment Variables

| Name | Description | Default |
|---|---|---|
| `REACT_APP_NAME` | name extracted from package.json` | - |
| `REACT_APP_VERSION` | version extracted from package.json` | - |
| `REACT_APP_COMMIT` | commit extracted from git history | - |

### Runtime Configuration

A deployment sets these on the container; the entrypoint writes them into `runtime-env.js`. Locally they come from `.env`.

| Name | Description |
|---|---|
| `REACT_APP_API_BASE_URL` | the IAM's public API as the browser reaches it through the gateway (a path or a URL) |
| `REACT_APP_IAM_PERMISSION_PREFIX` | the prefix the deployment gives the IAM's permission ids; the app looks for `<prefix>.<operationId>` in the signed-in session |

### Local Development Only

| Name | Description | Default |
|---|---|---|
| `DEV_PORT` | webpack server dev http port | 3012 |
| `DEV_IAM_URL` | where the dev server proxies `/iam-api` to: a gateway serving the IAM's public API | - |
