# nodetest

To run the service:

```
node main.js
```

The service endpoint is http://localhost:8082/

The default credentials are username: `testuser`, password: `testpass`.

### Layout

The code is laid out as follows:

- `main.js` - entry point for the program
- `dispatcher.js` - dispatches HTTP requests for APIs and/or static data
- `api/{name}.js` - handles HTTP requests of the form `/api/{name}/...`
- `service/*.js` - tools and libraries called by dispatcher and APIs
- `static/` - static HTML data served for non-API requests
- `sessions/` - logged-in user sessions (if any)
- `data/` - API data storage
- `users.json` - list of username and sha256(passwords)
- `test.js` - script to run unit tests
- `tests/` - unit tests
