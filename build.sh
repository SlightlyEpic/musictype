# This is scuffed but im making the dist directory inside server so that i dont have to copy node_modules

# Build client
cd client
npm run build

# Build server
cd ../server
npm run build

# Delete older build
cd ..
rm -rf server/dist
mkdir server/dist

# Move files
mv server/serverDist/* client/clientDist server/dist

echo ""
echo "Finished build at server/dist/"
