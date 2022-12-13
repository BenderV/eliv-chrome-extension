# ELIV - Explain Like I'm Five

[Chrome Extension](https://chrome.google.com/webstore/detail/explainer/cnpglhcliocjaipbapalbdlbfepmamlc?hl=en&authuser=0)

A chrome extension that uses a GPT-3 model to explain text on a webpage. Select text and click the extension to get a simple explanation.

## Installation

### Chrome Extension

-   Go to chrome://extensions/
-   Enable developer mode
-   Click on "Load unpacked"
-   Select the folder

### Server

-   Install dependencies `yarn`
-   Change the `OPENAPI_KEY` in `src/index.js` to your GPT-3 API key
-   Run `npx wrangler dev src/index.js` in your terminal to start a development server
-   Open a browser tab at http://localhost:8787/ to see your worker in action
-   Run `npx wrangler publish src/index.js --name explainer` to publish your worker

### License

MIT :)
