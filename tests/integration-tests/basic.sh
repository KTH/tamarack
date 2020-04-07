#!/bin/bash

info() { printf "\034[0;31m     $@\033[0;0m | $(date)\n"; }
error() { printf "\033[0;31m    ERROR: $@\033[0;0m | $(date)\n"; }
passed() { printf "\033[0;32m   OK: $@\033[0;0m | $(date)\n"; }

#
# Path to the Cisco vpn client.
#
if [ -z "$URL_PREFIX" ]; then
    URL_PREFIX="http://web"
    sleep 5s
fi


FAILED=""

# ------------------------

RESPONSE=`curl --silent --show-error --max-time 5 "$URL_PREFIX/_monitor"`
PATTERN="active" # Set by process.env.PORTILLO_CLUSTER

if [[ "$RESPONSE" != *"$PATTERN"* ]]; then
    info $RESPONSE
    error "URL '/_monitor' does not contain env PORTILLO_CLUSTER '$PATTERN'."
    exit -1
fi

passed "/_monitor contains APPLICATION_STATUS: OK."

# ------------------------

RESPONSE=`curl --silent --show-error --max-time 5 "$URL_PREFIX/_$PORTILLO_CLUSTER"`
PATTERN="$PORTILLO_CLUSTER" # Set by process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT

if [[ "$RESPONSE" != *"$PATTERN"* ]]; then
    info $RESPONSE
    error "URL '/_$PORTILLO_CLUSTER' does not contain env PORTILLO_CLUSTER '$PATTERN'."
    exit -1
fi

passed "/_$PORTILLO_CLUSTER contains $PORTILLO_CLUSTER."

# ------------------------

RESPONSE=`curl --silent --show-error --max-time 5 "$URL_PREFIX/_about"`
PATTERN="Docker image"

if [[ "$RESPONSE" != *"$PATTERN"* ]]; then
    info $RESPONSE
    error "URL '/_about' does not contain about information. (Looking for '$PATTERN')"
    FAILED="FAILED"
else
    passed "/_about shows about information."
fi

# ------------------------

RESPONSE=`curl --silent --show-error --max-time 5 "$URL_PREFIX/"`
PATTERN="Applications"

if [[ "$RESPONSE" != *"$PATTERN"* ]]; then
    info $RESPONSE
    error "URL '/' does not show index title '$PATTERN'."
    FAILED="FAILED"
else
    passed "/ shows index page."
fi

# ------------------------

RESPONSE=`curl --silent --show-error --max-time 5 "$URL_PREFIX/missing-page"`
PATTERN="Sorry, we have nothing to show"

if [[ "$RESPONSE" != *"$PATTERN"* ]]; then
    info $RESPONSE
    error "URL /missing-page - 404-page does not show text '$PATTERN'."
    FAILED="FAILED"
else
    passed "/missing-page - 404-page works."
fi

# ------------------------

RESPONSE=`curl --silent --show-error --max-time 5 "$URL_PREFIX/error5xx.html"`
PATTERN="Sorry, the service is not working as intended"

if [[ "$RESPONSE" != *"$PATTERN"* ]]; then
    info $RESPONSE
    error "URL '/5xx.html page does not show text '$PATTERN' to say a service is broken."
    FAILED="FAILED"
else
    passed "/5xx.html page works."
fi



# ------------------------

RESPONSE=`curl --silent --show-error --max-time 5 "$URL_PREFIX/$DOMAIN_OWNERSHIP_VERIFICATION_FILE"`
PATTERN="$DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT" # Set by process.env.DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT

if [[ "$RESPONSE" != *"$PATTERN"* ]]; then
    info $RESPONSE
    error "URL '/$DOMAIN_OWNERSHIP_VERIFICATION_FILE' does not contain env DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT '$PATTERN'."
    exit -1
fi

passed "/$DOMAIN_OWNERSHIP_VERIFICATION_FILE contains $DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT."


if [[ "$FAILED" != *"FAILED"* ]]; then
    exit 0
fi


# TODO: detectify stuff
exit 1
