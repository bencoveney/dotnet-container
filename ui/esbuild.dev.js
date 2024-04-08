import * as esbuild from "esbuild";
import http from "node:http";
import {
  buildConfig,
  cleanDirectory,
  copyAssets,
  staticAssetsPath,
  loadEnvFile,
} from "./esbuild.common.js";

loadEnvFile("./.env");
const proxyPort = 5001;
const esBuildPort = 5002;
const apiPort = 5000; // process.env.API_PORT
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
      `${localhost}:${proxyPort}${req.url} => ${options.hostname}:${options.port}${options.path} - ${proxyRes.statusCode}`
    );
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });
  proxyReq.on("error", (e) => {
    console.log(
      `${localhost}:${proxyPort}${req.url} => ${options.hostname}:${options.port}${options.path} - 500 ${e.message}`
    );
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal server error");
    return;
  });
  req.pipe(proxyReq, { end: true });
}

http
  .createServer((req, res) => {
    if (req.url.startsWith(apiPath)) {
      proxyRequest(req, res, {
        hostname: "localhost",
        port: apiPort,
        path: req.url.substring(apiPath.length - 1),
      });
    } else {
      proxyRequest(req, res, {
        hostname: host,
        port: esBuildPort,
        path: req.url,
      });
    }
  })
  .listen(proxyPort);

console.log(`http://${localhost}:${proxyPort}`);
