#!/bin/bash
set -e
set -u

HEROKU_REMOTE=git@heroku.com:admin.git
CURRENT_COMMIT=`git rev-parse HEAD`

echo 'deploying to heroku server ...'
git config --global user.email "dev@photoandgo.com"
git config --global user.name "circleci"
git remote add heroku $HEROKU_REMOTE
# git add .
# git commit -m 'updating site from CircleCI - $CURRENT_COMMIT'
git push -f heroku master
