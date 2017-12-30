#!/usr/bin/env bash

USER_HOME=$(eval echo ~${SUDO_USER})

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

COINPATH=${USER_HOME}/coins.txt

cp -r ${DIR}/.conkyrc ${USER_HOME}

chown ${SUDO_UID}:${SUDO_GID} ${USER_HOME}/.conkyrc

touch ${COINPATH}

npm install -g

echo done
