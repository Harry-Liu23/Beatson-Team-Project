#!/bin/bash

FLASK_APP_URL="http://127.0.0.1:2020/login"  # point to flask app url


check_flask_status() {
    http_status=$(wget --spider -S "$FLASK_APP_URL" 2>&1 | grep "HTTP/" | awk '{print $2}')

    if [ "$http_status" == "200" ] || [ "$http_status" == "404" ] || [ "$http_status" == "405" ]; then
        echo "Flask app is running properly. HTTP Status: $http_status"
    else
        echo "Flask app is not running or there is an issue."
    fi
}


check_flask_status