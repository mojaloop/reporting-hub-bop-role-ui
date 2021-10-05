# First part, build the app
FROM node:lts-alpine as builder
LABEL stage=reporting-hub-bop-role-ui-builder

USER root
WORKDIR /opt/reporting-hub-bop-role-ui

COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile

COPY . .

# Provide environment build variables for setting endpoints dynamically
# TODO: figure out how we are hosting the api to return remote urls
#       figure out kratos auth
ARG PUBLIC_PATH
ENV PUBLIC_PATH=$PUBLIC_PATH

ARG ROLE_API_URL
ENV ROLE_API_URL=$ROLE_API_URL

# RUN yarn build
RUN yarn build

FROM node:lts-alpine
WORKDIR /opt/reporting-hub-bop-role-ui

# Create empty log file & link stdout to the application log file
RUN mkdir ./logs && touch ./logs/combined.log
RUN ln -sf /dev/stdout ./logs/combined.log

# Create a non-root user: shell-user
RUN adduser -D shell-user
USER shell-user

COPY --chown=shell-user --from=builder /opt/reporting-hub-bop-role-ui .

EXPOSE 3012
CMD ["npm", "run", "serve"]
