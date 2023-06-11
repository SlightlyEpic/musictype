if ! test -f server/dist/app.js ; then
./build.sh
fi

node server/dist/app.js
