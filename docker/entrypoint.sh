#!/bin/sh

# Run the script before starting the server
sh /loadRuntimeConfig.sh

# This will exec the CMD from your Dockerfile, i.e. "npm start"
exec "$@"
