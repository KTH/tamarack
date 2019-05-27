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

### error5xx.html - Custom error pages for service mesh
Generic error page that also tries to include information about an application if the error page is shown for a missing service (501 Bad gateway). For more information see https://docs.traefik.io/configuration/commons/#custom-error-pages
