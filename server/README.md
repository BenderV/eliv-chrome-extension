## Installation

-   Run `npx wrangler dev src/index.js` in your terminal to start a development server
-   Open a browser tab at http://localhost:8787/ to see your worker in action
-   Run `npx wrangler publish src/index.js --name explainer` to publish your worker

## Secrets

The necessary secret is OPENAPI_KEY

### Dev

Add OPENAPI_KEY=<VALUE> in your environment variables

### Prod

Run `echo <VALUE> | wrangler secret put OPENAPI_KEY`
