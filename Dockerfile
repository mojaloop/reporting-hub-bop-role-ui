# First part, build the app
FROM node:16-alpine as reporting-hub-bop-role-ui-builder
LABEL stage=reporting-hub-bop-role-ui-builder

COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile

COPY ./ .

# Adds the package version and commit hash
ARG REACT_APP_NAME
ENV REACT_APP_NAME=$REACT_APP_NAME

ARG REACT_APP_VERSION
ENV REACT_APP_VERSION=$REACT_APP_VERSION

ARG REACT_APP_COMMIT
ENV REACT_APP_COMMIT=$REACT_APP_COMMIT

# Public Path
ARG PUBLIC_PATH
ENV PUBLIC_PATH=$PUBLIC_PATH

RUN yarn build

# Second part, create a config at boostrap via entrypoint and and serve it
FROM caddy/caddy:alpine

# JQ is used to convert from JSON string to json file in bash
RUN apk add --no-cache jq

COPY --from=0 dist/ .
COPY docker/Caddyfile /srv/Caddyfile
COPY docker/entrypoint.sh /entrypoint.sh
COPY docker/loadRuntimeConfig.sh /loadRuntimeConfig.sh

RUN chmod +x /entrypoint.sh
RUN chmod +x /loadRuntimeConfig.sh

# Provide environment variables for setting endpoints dynamically
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

ARG REACT_APP_MOCK_API
ENV REACT_APP_MOCK_API=$REACT_APP_MOCK_API

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]

CMD ["caddy", "run", "--watch"]
# TODO: Need to add 8080 to image-scan whitelist
#       Need to switch user away from root
#       Investigate Feed data unavailable, cannot perform CVE scan for distro: alpine:3.14.2
