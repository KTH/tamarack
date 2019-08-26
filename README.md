# Tamarack
If the reverse proxy in Docker Swarm clusters do not match any applications. Tamarack is the catch all application that will show the 404 page for a request.

Tamarack also tells other proxies whats cluster it is via /_monitor

## Routes handled by Tamarack
- [https://app.kth.se/_about](https://app.kth.se/_about)
- [https://app.kth.se/_monitor]()
- [https://app.kth.se/missing](https://app.kth.se/missing)
- [https://app.kth.se/error5xx.html](https://app.kth.se/error5xx.html)

### _about - Information page
Information about a running instance. Version, build date etc.

### _monitor - Public monitoring
Endpoint for public monitoring. Page should always contain `APPLICATION_STATUS: OK`

### 404-pages
Any request to the service mesh that does not match an application gets served a 404 page.

### error5xx.html - Custom error pages for service mesh
Generic error page that also tries to include information about an application if the error page is shown for a missing service (501 Bad gateway). For more information see https://docs.traefik.io/configuration/commons/#custom-error-pages


## Tests

Using NPM `npm test` or using Docker `ID=$(docker build -q .) && LOCAL_IMAGE_ID=$ID docker-compose -f docker-compose-unit-tests.yml up --abort-on-container-exit --always-recreate-deps`

```bash
  Template handling
    ✓ Path '/' should contain a title.
    ✓ Path '/error5xx' should contain a message.
    ✓ Path '/error404' should contain a message.
    ✓ The header should contain env Application Insights key 'APPINSIGHTS_INSTRUMENTATIONKEY' if set.
    ✓ Path '/_monitor' should contain 'APPLICATION_STATUS: OK'.
    ✓ Path '/_monitor' should contain cluster name specified in env 'PORTILLO_CLUSTER' if set.
    ✓ Path '/_monitor' should contain 'No env PORTILLO_CLUSTER set.' when env 'PORTILLO_CLUSTER' is not set.
    ✓ Path '/_clusters' should return 8 IP-numbers.
```
