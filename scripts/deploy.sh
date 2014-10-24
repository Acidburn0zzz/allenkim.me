ssh allen@10.16.88.34 << EOF
  set -x
  cd /home/allen/pastes
  git pull
  npm install
  pid=\$(ps aux | grep 'node server.js' | awk '{print \$2}' | head -1)
  echo \$pid | xargs kill
  nohup node app.js 2>&1 > app.log &
  echo "THE END"
EOF
