ARG NODE_VERSION=24.19.0-alpine3.24
ARG NGINX_VERSION=1.31.3-alpine

FROM node:${NODE_VERSION} AS builder
WORKDIR /opt/reporting-hub-bop-role-ui
ENV PATH=/opt/reporting-hub-bop-role-ui/node_modules/.bin:$PATH

COPY package.json /opt/reporting-hub-bop-role-ui/
COPY yarn.lock /opt/reporting-hub-bop-role-ui/

RUN yarn --frozen-lockfile

COPY ./ /opt/reporting-hub-bop-role-ui/

# Adds the package version and commit hash
ARG REACT_APP_NAME
ENV REACT_APP_NAME=$REACT_APP_NAME

ARG REACT_APP_VERSION
ENV REACT_APP_VERSION=$REACT_APP_VERSION

ARG REACT_APP_COMMIT
ENV REACT_APP_COMMIT=$REACT_APP_COMMIT

# Build production application files
RUN yarn build

# Second part, create a config at boostrap via entrypoint and and serve it
ARG NGINX_VERSION
FROM nginx:${NGINX_VERSION}

# Create user with uid 1001. Mojaloop helm templates default to uid 1001 for
# running containers as non-root for better security
RUN addgroup -g 1001 appuser && \
    adduser -S -u 1001 -g appuser appuser

# Give user permission to clean up ngnix configuration files
RUN chown -R appuser:appuser /etc/nginx
WORKDIR /usr/share/nginx/html

# Copy build over from builder
COPY --from=builder /opt/reporting-hub-bop-role-ui/dist/ /usr/share/nginx/html

# The document the platform composes this service's authorization from, at the
# path a deployment names it by
COPY --from=builder /opt/reporting-hub-bop-role-ui/src/api /opt/app/src/api

# Remove nginx config
RUN rm /etc/nginx/conf.d/default.conf /etc/nginx/nginx.conf

# Copy over local config and script
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/start.sh /usr/share/nginx/start.sh

# Copy over scripts that enable runtime configuration
COPY docker/entrypoint.sh /usr/share/nginx/html/entrypoint.sh
COPY docker/loadRuntimeConfig.sh /usr/share/nginx/html/loadRuntimeConfig.sh

# Give appuser permissions to nginx
RUN chown -R appuser:appuser \
    /usr/share/nginx \
    /var/cache/nginx \
    /var/run/

# Make scripts executable
RUN chmod +x /usr/share/nginx/html/entrypoint.sh
RUN chmod +x /usr/share/nginx/html/loadRuntimeConfig.sh

# Provide environment variables for setting endpoints dynamically
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

ARG REACT_APP_MOCK_API
ENV REACT_APP_MOCK_API=$REACT_APP_MOCK_API

USER appuser

EXPOSE 8081
ENTRYPOINT ["/usr/share/nginx/html/entrypoint.sh"]
CMD ["sh", "/usr/share/nginx/start.sh"]
# TODO: Need to add 8081 to image-scan whitelist
