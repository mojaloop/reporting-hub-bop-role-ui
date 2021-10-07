#!/bin/bash
sed -i 's#__REACT_APP_API_BASE_URL__#'"$REACT_APP_API_BASE_URL"'#g' runtime-env.js
sed -i 's#__REACT_APP_MOCK_API__#'"$REACT_APP_MOCK_API"'#g' runtime-env.js

exec "$@"
