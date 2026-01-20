// server.js
import "dotenv/config";
import http from "http";
import https from "https";
import fs from "fs";
import app from "./app.js";

const isProd = process.env.NODE_ENV === "production";
const domain = process.env.DOMAIN || "procodrr.cloud";

if (!isProd) {
  // Development: HTTP only
  const port = Number(process.env.PORT || 3000);

  http.createServer(app).listen(port, () => {
    console.log(`Dev HTTP running on http://localhost:${port}`);
  });

} else {
  // Production: HTTPS + HTTP redirect
  const HTTP_PORT = 80;
  const HTTPS_PORT = 443;

  const keyPath = `/etc/letsencrypt/live/${domain}/privkey.pem`;
  const certPath = `/etc/letsencrypt/live/${domain}/fullchain.pem`;

  const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  // HTTPS server
  https.createServer(sslOptions, app).listen(HTTPS_PORT, () => {
    console.log(`HTTPS running on https://${domain}`);
  });

  // HTTP redirect server
  http.createServer((req, res) => {
    const host = req.headers.host || domain;
    res.writeHead(301, { Location: `https://${host}${req.url}` });
    res.end();
  }).listen(HTTP_PORT, () => {
    console.log(`HTTP redirect running on port ${HTTP_PORT}`);
  });
}
