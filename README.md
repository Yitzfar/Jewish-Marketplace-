# Jewish Marketplace

A bilingual Yiddish and English multi-vendor marketplace.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Yitzfar/Jewish-Marketplace-)

## One-click deployment

1. Click **Deploy to Render** above and sign in or create a Render account.
2. Review the service settings and click **Apply**. Render reads `render.yaml`, installs dependencies, builds the frontend, and starts the server.
3. When deployment finishes, open the service URL Render provides.

The app starts without an AI key using built-in fallback responses. To enable Gemini-powered assistant and listing features, open the service's **Environment** settings in Render, add `GEMINI_API_KEY`, and redeploy. Keep the key secret; do not commit it to this repository.

## Run locally

Requires Node.js 22.14.0 or later.

```bash
npm install
cp .env.example .env
# Optional: add your Gemini API key to .env
npm run dev
```

Then open http://localhost:3000.

To build and run in production mode locally:

```bash
npm run build
npm start
```
