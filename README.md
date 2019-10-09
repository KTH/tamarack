# Tamarack ![alt text](https://api.travis-ci.org/KTH/tamarack.svg?branch=master)

_If the reverse proxy in Docker Swarm clusters do not match any applications. Tamarack is the catch all application that will show the 404 page for a request._

Tamarack also tells other proxies whats cluster it is via /\_monitor

## Routes handled by Tamarack

- [https://app.kth.se/\_about](https://app.kth.se/_about)
- [https://app.kth.se/\_monitor]()
- [https://app.kth.se/missing](https://app.kth.se/missing)
- [https://app.kth.se/error5xx.html](https://app.kth.se/error5xx.html)

### \_about - Information page

Information about a running instance. Version, build date etc.

### \_monitor - Public monitoring

Endpoint for public monitoring. Page should always contain `APPLICATION_STATUS: OK`

### 404-pages

Any request to the service mesh that does not match an application gets served a 404 page.

### error5xx.html - Custom error pages for service mesh

Generic error page that also tries to include information about an application if the error page is shown for a missing service (501 Bad gateway). For more information see https://docs.traefik.io/configuration/commons/#custom-error-pages

## Unit tests

https://travis-ci.org/KTH/tamarack

### In Docker

Run tests inside the :whale: Docker container using `npm run unit-tests-in-docker`. The script build the Docker container according to _Dockerfile_ and then mounts the `/tests` catalog into it, and runs `npm test` inside the container. No dependencies other then Docker needed.

Run test directly `npm install` and then `npm test` in your development setup to run unit tests.

```text
  Template paths handling
    ✓ Path '/' should contain a title.
    ✓ Path '/error5xx' should contain a message.
    ✓ Path '/error404' should contain a message.
    ✓ Path '/_monitor' should contain 'APPLICATION_STATUS: OK'.
    ✓ Path '/_monitor' should contain cluster name specified in env 'PORTILLO_CLUSTER' if set.
    ✓ Path '/_monitor' should contain 'No env PORTILLO_CLUSTER set.' when env 'PORTILLO_CLUSTER' is not set.
    ✓ Path '/_clusters' should return 8 IP-numbers.

  ApplicationInsights handling
    ✓ The Application Insights script is only added to the head tag when env 'APPINSIGHTS_INSTRUMENTATIONKEY' is set.
    ✓ All pages should contain env Application Insights key 'APPINSIGHTS_INSTRUMENTATIONKEY' if set.

```

### Integration tests in Docker

Run integration tests against the service running as a :whale: Docker container using `npm run integration-tests-in-docker`. The script build the Docker container according to _Dockerfile_ and then starts another image that runs a _curl_-command against the service.
