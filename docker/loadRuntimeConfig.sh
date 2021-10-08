#!/bin/bash
sed -i 's#__REACT_APP_API_BASE_URL__#'"$REACT_APP_API_BASE_URL"'#g' /usr/share/nginx/html/runtime-env.js
sed -i 's#__REACT_APP_MOCK_API__#'"$REACT_APP_MOCK_API"'#g' /usr/share/nginx/html/runtime-env.js

sed -i 's#__PUBLIC_PATH__#'"$PUBLIC_PATH"'#g' /usr/share/nginx/html/index.html
sed -i 's#__PUBLIC_PATH__#'"$PUBLIC_PATH"'#g' /usr/share/nginx/html/main.js
sed -i 's#__PUBLIC_PATH__#'"$PUBLIC_PATH"'#g' /usr/share/nginx/html/app.js

exec "$@"
