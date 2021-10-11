FROM node:lts-alpine as builder

WORKDIR /opt/reporting-hub-bop-shell
ENV PATH /opt/reporting-hub-bop-shell/node_modules/.bin:$PATH

RUN apk add --no-cache -t build-dependencies git make gcc g++ python libtool autoconf automake \
    && cd $(npm root -g)/npm \
    && npm config set unsafe-perm true \
    && npm install -g node-gyp

COPY package.json /opt/reporting-hub-bop-shell/
COPY yarn.lock /opt/reporting-hub-bop-shell/

RUN yarn --frozen-lockfile

COPY ./ /opt/reporting-hub-bop-shell/

# Adds the package version and commit hash
ARG REACT_APP_NAME
ENV REACT_APP_NAME=$REACT_APP_NAME

ARG REACT_APP_VERSION
ENV REACT_APP_VERSION=$REACT_APP_VERSION

ARG REACT_APP_COMMIT
ENV REACT_APP_COMMIT=$REACT_APP_COMMIT

# Public Path - Placeholder that is overwritten at runtime
ARG PUBLIC_PATH
ENV PUBLIC_PATH=__PUBLIC_PATH__

RUN yarn build

# Second part, create a config at boostrap via entrypoint and and serve it
FROM nginx:1.16.0-alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /opt/reporting-hub-bop-shell/dist/ /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf /etc/nginx/nginx.conf
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/start.sh /usr/share/nginx/start.sh

COPY docker/entrypoint.sh /usr/share/nginx/html/entrypoint.sh
COPY docker/loadRuntimeConfig.sh /usr/share/nginx/html/loadRuntimeConfig.sh

RUN chmod +x /usr/share/nginx/html/entrypoint.sh
RUN chmod +x /usr/share/nginx/html/loadRuntimeConfig.sh

# Provide environment variables for setting endpoints dynamically
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

ARG REACT_APP_MOCK_API
ENV REACT_APP_MOCK_API=$REACT_APP_MOCK_API

EXPOSE 8081

ENTRYPOINT ["/usr/share/nginx/html/entrypoint.sh"]

CMD ["sh", "/usr/share/nginx/start.sh"]
# TODO: Need to add 8080 to image-scan whitelist
#       Need to switch user away from root
#       Investigate Feed data unavailable, cannot perform CVE scan for distro: alpine:3.14.2
