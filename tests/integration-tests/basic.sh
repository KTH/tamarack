#!/bin/bash

info() { printf "\033[1;31m\n   %s\033[0;0m$@\n\n";  }
error() { printf "\033[0;31m\n • $@\033[0;0m"; }
passed() { printf "\033[0;32m • $@\033[0;0m\n"; }

#
# Path to the Cisco vpn client.
#
if [ -z "$URL_PREFIX" ]; then
    URL_PREFIX="http://web"
    sleep 5s
fi

FAILED=""

#
# Curls a url and tests if the response contains a string.
# If it fails sets FAILED to true.
#
# Usage: expectPathToContain "/_monitor" "active"
#
expectPathToContain() {
    
    ENDPOINT="$1"
    PATTERN="$2"
    TEST_DESCRIPTION="$3"
    
    TEST_URL="$URL_PREFIX$ENDPOINT"

    curl -k -S --max-time 3 $TEST_URL > .curl.log 2>&1
    RESULT=$(cat .curl.log)
    
    if [[ "$RESULT" == *"$PATTERN"* ]]; then
        if [ ! -z "$TEST_DESCRIPTION" ]; then
            passed "$TEST_DESCRIPTION."
        else 
            passed "$TEST_URL contains $PATTERN"
        fi
 
    else
        if [ ! -z "$TEST_DESCRIPTION" ]; then
            error "$TEST_DESCRIPTION"
        fi
        info "'$TEST_URL' does not contain pattern '$PATTERN'."
        
        FAILED="true"
    fi

}

# ---------------- Tests ----------------

expectPathToContain "/_monitor" "active" "The monitor page should includ the cluster name from env PORTILLIO_CLUSTER"
expectPathToContain "/_monitor" "APPLICATION_STATUS: OK" "Default check APPLICATION_STATUS: OK"
expectPathToContain "/_active" "active" "The cluster name should be an endpoint" 
expectPathToContain "/_about" "Docker image" "The about page should show Docker images information"
expectPathToContain "/" "Application" "The index pages should include a title"
expectPathToContain "/missing-page" "Sorry, we have nothing to show" "The 404 pages should show a title"
expectPathToContain "/error5xx.html" "Bad Gateway - Tamarack" "There should be a route for handling 502 Bad Gateway from proxied"
expectPathToContain "/error5xx.html" "var url = \"https://api.kth.se/api/pipeline/v1/search/active/\"" "This is the url used to look up info on applications from external API on 502 Bad Gateway"
expectPathToContain "/$DOMAIN_OWNERSHIP_VERIFICATION_FILE" "$DOMAIN_OWNERSHIP_VERIFICATION_FILE_CONTENT" "A dynamic path that can be used to verify domains for used SaaS "
expectPathToContain "/error/500" "Bad Gateway - Tamarack" "Should contain a 5xx title "
expectPathToContain "/error/404" "Sorry, we have nothing to show for the web address you entered." "A status with 404 should show a 404 page"

# Result
if [[ "$FAILED" != *"true"* ]]; then
    info "All end-to-end tests passed."
    exit 0
else
    echo ""
    exit 1
fi


