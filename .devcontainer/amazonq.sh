#!/bin/bash
curl -sSf "https://desktop-release.q.us-east-1.amazonaws.com/latest/q-x86_64-linux.zip" -o /tmp/amazonq.zip
unzip /tmp/amazonq.zip -d /tmp/amazonq
/tmp/amazonq/q/install.sh --no-confirm
