# Tamarack
If the reverse proxy in Docker Swarm clusters do not match any applications. Tamarack is the catch all application that will show the 404 page for a request.

Tamarack also tells other proxies whats cluster it is via /_monitor

## Routes handled by Tamarack
```
https://app.kth.se/_about
https://app.kth.se/_monitor
https://app.kth.se/missing
```

