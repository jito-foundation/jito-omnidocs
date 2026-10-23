---
title: Ping
subtitle: Keep the connection warm before you send
---

Lightweight keepalive endpoint. Use this to warm the HTTP/TCP connection before making requests to the service.

## Endpoint

```text
GET /api/v1/ping
```

## Authentication

No auth is required.

## Response

Always returns:

```http
200 OK
Access-Control-Allow-Origin: *
Content-Type: text/plain; charset=utf-8

ok
```

## TypeScript Example

```ts
const ENDPOINT = "https://mainnet.hudson.jito.wtf/api/v1/ping";

export async function warmConnection(): Promise<void> {
  const response = await fetch(ENDPOINT, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`ping failed: ${response.status}`);
  }
}
```
