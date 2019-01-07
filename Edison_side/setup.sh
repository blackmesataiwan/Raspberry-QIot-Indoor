#!/bin/sh

wget https://github.com/intel-iot-devkit/upm/raw/master/src/lcm1602/hd44780_bits.h -O ~/.node-gyp
npm install
cp iotkit.service /lib/systemd/system/
systemctl daemon-reload
systemctl enable iotkit.service
systemctl start iotkit.service