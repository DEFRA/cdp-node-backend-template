#!/bin/bash

compose_file='.github/template/template-compose.yml'

checkUrl() {
    URL=$1

    set +e
    # Call the URL and get the HTTP status code
    HTTP_STATUS=$(curl -o /dev/null -s -w "%{http_code}\n" "$URL")
    set -e

    # Check if the HTTP status code is 200
    if [ "$HTTP_STATUS" -eq 200 ]; then
        echo " ✔ $URL returned a 200 OK status."
        return 0
    else
        echo " ❌ $URL returned a status of $HTTP_STATUS. Exiting with code 1."
        return 1
    fi
}

checkLogSchema() {
    set +e
    local log
    log=$(docker compose -f "$compose_file" logs service -n 1 --no-color --no-log-prefix 2>/dev/null)

    # Check if jq validation was successful
    if echo "$log" | jq empty > /dev/null; then
      echo " ✔ Log entry is valid JSON."
      set -e
      return 0
    else
      echo " ❌ Log entry is not valid JSON."
      set -e
      return 1
    fi
}

setup() {
  set -e

  # Start templated service
  docker compose -f "$compose_file" up --wait --wait-timeout 60 -d --quiet-pull
  sleep 3
}

# Stop docker on exist and cleanup tmp files
cleanup() {
    rv=$?
    echo "cleaning up $rv"
    rm -f .github/template/ssl/*
    docker compose -f "$compose_file" down
    exit $rv
}
trap cleanup EXIT

run_tests() {
  # Run the tests
  echo "-- Running template tests ---"

  # Check endpoints respond
  checkUrl "http://localhost:8085/health"

  # Check its using ECS
  checkLogSchema
}

# Start Docker
setup
run_tests

