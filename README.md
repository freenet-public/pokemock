# Pokemock

A mock server generated from one or more arbitrary Swagger files.
Supports seeding, timeouts, response picking,
entity memory, semantic action inference, etc.


## Usage

```
Syntax:
  pokemock <swagger-urls-or-files> ... [-h] [-v] [-w] [-p <port>]

Options:
  -h, --help        Show help
  -v, --version     Show version
  -p, --port <port> Set server port, default is 8000
  -w, --watch       Watch mode: Restart on Swagger changes
  -k, --killable    Publish /kill endpoint to stop the service
```


## Server

The mock server listens to the specified port and
mocks endpoints defined in the provided Swagger document.
Additionally, it publishes a Swagger UI under `/ui`,
the Swagger API under `/api-docs` and a `/kill` endpoint for shutdown.


## Request Headers

Using optional headers, clients can control the server's behavior:

- __X-Mock-Status__
  - Specifies the response status code
  - The correct response is inferred from the API if possible
  - Defaults to the first response code specified in the API
- __X-Mock-Seed__
  - Specifies a seed for data generation
  - If omitted, a random seed is generated
  - The current seed is always returned in a X-Mock-Seed response header
- __X-Mock-Time__
  - Specifies the minimum response time (milliseconds)
- __X-Mock-Size__
  - Specifies array size(s) in the response
  - Must be a valid JSON object of
    `<definitionName|attributeName>: <size>` pairs
  - If omitted, array sizes are randomly between 1 and 5
- __X-Mock-Depth__
  - Specifies the maximum JSON data depth
  - Defaults to 5
- __X-Mock-Override__
  - Specifies response data via [JSON Path](https://github.com/dchester/jsonpath)
  - Must be a valid JSON object of `<jsonPath>: <data>` pairs
  - `<data>` is arbitrary JSON
- __X-Mock-Memory__
  - Specifies memory usage
  - If set to 0, disable memory features
  - Memory is enabled by default
- __X-Mock-Replay__
  - Specifies the number of times the current X-Mock-* headers should be replayed
  - The next N requests to the requested URL will replay the current X-Mock-* headers
- __X-Mock-Replay-Pattern__
  - Specifies a regular expression to match for X-Mock-Replay
  - If omitted, the exact path is used for replaying


## Memory

Whenever an entity containing an ID is generated it is remembered by the server.
If the entity is requested again, the remembered data is returned.
This also applies to sub-entities across endpoints.

Additionally, the server tries to infer semantic actions from requests,
such as:

- Get by id
- Delete by id
- Update by id
- Create new entity

These actions are applied to known entities in memory.
For example, requesting a deleted entity will result in a 404 response.


## Customization

Pokemock provides a set of [Express](http://expressjs.com/de/) middlewares
which you can use independently.
The default app defined in `createDefaultApp.js` is an opinionated stack of
middlewares which you're encouraged to hack on.
By re-arranging and adding middlewares (especially generators)
you can tailor Pokemock to fit your APIs.
