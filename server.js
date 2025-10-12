const express = require("express");
const httpProxy = require("http-proxy");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const proxy = httpProxy.createProxyServer({});
const fetch = require("node-fetch");

// Parse JSON bodies
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve React static files
app.use(express.static(path.join(__dirname, "build")));

// Proxy /api requests to Node-RED
app.use("/api", (req, res) => {
  console.log(
    `[${new Date().toISOString()}] Received request: ${req.method} ${
      req.originalUrl
    }`
  );
  proxy.web(
    req,
    res,
    { target: "http://localhost:2300", changeOrigin: true },
    (err) => {
      console.error(`[${new Date().toISOString()}] Error in proxy:`, err);
      res.status(500).send("Proxy Error");
    }
  );
});

proxy.on("proxyReq", (proxyReq, req, res) => {
  if (req.body && Object.keys(req.body).length > 0) {
    const bodyData = JSON.stringify(req.body);
    proxyReq.setHeader("Content-Type", "application/json");
    proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
    proxyReq.write(bodyData);
  }
  console.log(`[${new Date().toISOString()}] Proxied URL:`, proxyReq.path);
  console.log(
    `[${new Date().toISOString()}] Proxied headers:`,
    proxyReq.getHeaders()
  );
});

proxy.on("proxyRes", (proxyRes, req, res) => {
  let responseBody = "";
  proxyRes.on("data", (chunk) => {
    responseBody += chunk.toString();
  });
  proxyRes.on("end", () => {
    console.log(`[${new Date().toISOString()}] Response from Node-RED:`, {
      statusCode: proxyRes.statusCode,
      headers: proxyRes.headers,
      body: responseBody,
    });
  });
});

// Handle React routing, return all requests to React app
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
