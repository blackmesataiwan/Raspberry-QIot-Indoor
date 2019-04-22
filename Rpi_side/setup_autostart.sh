#!/bin/bash

cp iotkit.service /lib/systemd/system/
systemctl daemon-reload
systemctl enable iotkit.service
systemctl start iotkit.service