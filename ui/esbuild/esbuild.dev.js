import * as esbuild from "esbuild";
import http from "node:http";
import https from "node:https";
import {
  buildConfig,
  cleanDirectory,
  copyAssets,
  staticAssetsPath,
  certificatesPath,
  loadEnvFile,
  loadCertificates,
} from "./esbuild.common.js";

loadEnvFile("./.env");
const proxyPortHttp = 5001;
const proxyPortHttps = 5002;
const esBuildPort = 5003;
const apiPort = process.env.API_PORT;
const apiPath = process.env.API_PATH;
const localhost = "localhost"; // process.env.API_HOST

cleanDirectory(buildConfig.outdir);
copyAssets(staticAssetsPath, buildConfig.outdir);

const context = await esbuild.context({
  ...buildConfig,
});

const { host } = await context.serve({
  servedir: buildConfig.outdir,
  port: esBuildPort,
});

function proxyRequest(req, res, httpOptions) {
  const options = {
    ...httpOptions,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    console.log(
      `${localhost}:${req.socket.localPort}${req.url} => ${options.hostname}:${options.port}${options.path} - ${proxyRes.statusCode}`
    );
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });
  proxyReq.on("error", (e) => {
    console.log(
      `${localhost}:${req.socket.localPort}${req.url} => ${options.hostname}:${options.port}${options.path} - 500 ${e.message}`
    );
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal server error");
    return;
  });
  req.pipe(proxyReq, { end: true });
}

const app = (req, res) => {
  if (req.url.startsWith(apiPath)) {
    proxyRequest(req, res, {
      hostname: "localhost",
      port: apiPort,
      path: req.url.substring(apiPath.length - 1),
    });
  } else if (req.url === "/healthcheck") {
    console.log(`${host}:${req.port}${req.url} => 200`);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("OK");
    return;
  } else {
    proxyRequest(req, res, {
      hostname: host,
      port: esBuildPort,
      path: req.url,
    });
  }
};

const certs = loadCertificates(certificatesPath);
if (certs) {
  https.createServer(certs, app).listen(proxyPortHttps);
  console.log(`https://${localhost}:${proxyPortHttps}`);
} else {
  http.createServer(app).listen(proxyPortHttp);
  console.log(`http://${localhost}:${proxyPortHttp}`);
}
