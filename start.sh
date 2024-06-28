rm -rf build
npm run build
pm2 start "serve -s build -p 9000" --name "dashboard"
