#! /bin/sh
if grep -q "__REACT_APP_API_BASE_URL__" /usr/share/nginx/html/runtime-env.js; then
  sed -i 's#__REACT_APP_API_BASE_URL__#'"$REACT_APP_API_BASE_URL"'#g' /usr/share/nginx/html/runtime-env.js;
  sed -i 's#__REACT_APP_IAM_SERVICE__#'"$REACT_APP_IAM_SERVICE"'#g' /usr/share/nginx/html/runtime-env.js;
else
  echo "skipping replacement.";
fi

exec "$@"
