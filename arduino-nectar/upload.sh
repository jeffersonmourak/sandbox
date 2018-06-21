#!/bin/bash

file="`pwd`"/"$1"

echo `/Applications/Arduino.app/Contents/Java/hardware/tools/avr/bin/avrdude -C/Applications/Arduino.app/Contents/Java/hardware/tools/avr/etc/avrdude.conf -v -patmega2560 -cwiring -P/dev/cu.usbmodem1451 -b115200 -D -Uflash:w:$file:i`