# Tamarack
If the docker flow proxy routing in Everest clusters do not match any applications. Tamarack is the catch all application that will show the 404 page for a request.

Tamarack also tells NetScaler whats cluster it is via /_monitor

Tamarack is [deployed into clusters](https://gita.sys.kth.se/Infosys/cellus-registry/tree/master/deploy/tamarack) using Cellus-registry.

## Routes handled by Tamarack
```
https://app.kth.se/_about
https://app.kth.se/_monitor
https://app.kth.se/missing
```

