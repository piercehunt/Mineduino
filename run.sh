#!/usr/bin/env bash

function tab () {
    local cmd=""
    local cdto="$PWD"
    local args="$@"

    if [ -d "$1" ]; then
        cdto=`cd "$1"; pwd`
        args="${@:2}"
    fi

    if [ -n "$args" ]; then
        cmd="; $args"
    fi

    osascript &>/dev/null <<EOF
        tell application "iTerm"
            tell current terminal
                launch session "Default Session"
                tell the last session
                    write text "cd \"$cdto\"$cmd"
                end tell
            end tell
        end tell
EOF
}

cd ~/Documents/CanaryMod/
pkill -9 "tail"
tab "tail -f /dev/cu.usbmodem1411 | mosquitto_pub -t arduino1 -l"

osascript -e 'tell app "System Events" to display dialog "Dont forget to Open/Close the Arduino Serial Monitor to Start!! "' &

tab "java -Xmx1024m -classpath sc-mqtt.jar:craftbukkit-1.8.jar org.bukkit.craftbukkit.Main"
