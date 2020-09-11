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

Run tests inside the :whale: Docker container using `npm run test-unit-in-docker`. The script build the Docker container according to _Dockerfile_ and then mounts the `/tests` catalog into it, and runs `npm test` inside the container. No dependencies other then Docker needed.

Run test directly `npm install` and then `npm test` in your development setup to run unit tests.

```text

Bad Gatway

    ✓ Path '/error5xx.html' should contain a error message.
    ✓ When env 'APPLICATIONS_API_HOST' is missing, return 'api.kth.se' as default host
https://api.kth.se/api/pipeline/v1/search/active/
    ✓ When env 'APPLICATIONS_RUNNING_IN' is missing, return 'active' as part of the search endpoint
    ✓ The defined APPLICATIONS_RUNNING_IN is part of the search endpoint.

Cluster specifics

    ✓ Path '/_monitor' should contain cluster name specified in env 'PORTILLO_CLUSTER' if set.
    ✓ Path '/_monitor' should contain 'No env PORTILLO_CLUSTER set.' when env 'PORTILLO_CLUSTER' is not set.
    ✓ When env 'PORTILLO_CLUSTER' is set, use it as cluster name.
    ✓ When env 'PORTILLO_CLUSTER' is missing, return 'active' as default value.
    ✓ Path '/_clusters' should return 8 IP-numbers.


  9 passing (7ms)

```

### Integration tests in Docker

Run integration tests against the service running as a :whale: Docker container using `npm run test-integration-in-docker`. The script build the Docker container according to _Dockerfile_ and then starts another image that runs a _curl_-command against the service.

### Run end-to-end integration tests locally.

1. Start the service `npm run start-dev`
2. Run `npm run test-integration`. This will run the same tests as *npm run test-integratoin-in-docker*.

```
 • The monitor page should includ the cluster name from env PORTILLIO_CLUSTER.
 • Default check APPLICATION_STATUS: OK.
 • The cluster name should be an endpoint.
 • The about page should show Docker images information.
 • The index pages should include a title.
 • The 404 pages should show a title.
 • There should be a route for handling 502 Bad Gateway from proxied.
 • This is the url used to look up info on applications from external API on 502 Bad Gateway.
 • A dynamic path that can be used to verify domains for used SaaS .
```

