#!/usr/bin/env bash
brew install mosquitto
pkill -9 "mosquitto"


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

tab "/usr/local/sbin/mosquitto -c /usr/local/etc/mosquitto/mosquitto.conf"
#mosquitto_sub -t arduino1
tab "mosquitto_sub -t arduino1"

open ~/Documents/CanaryMod/ColorPal-with-LED2/ColorPal-with-LED2.ino
