/* eslint-disable @typescript-eslint/no-require-imports -- Node preload is CommonJS by design. */
const http = require("node:http");
const https = require("node:https");
const net = require("node:net");

function destinationFrom(args) {
  const first = args[0];
  if (typeof first === "string" || first instanceof URL) {
    try { return new URL(first).hostname; } catch { return ""; }
  }
  if (first && typeof first === "object") return String(first.hostname ?? first.host ?? "");
  return "";
}

function assertLocal(hostname) {
  if (!hostname || /^(localhost|127(?:\.\d{1,3}){3}|\[?::1\]?)$/i.test(hostname)) return;
  const error = new Error(`OFFLINE_BUILD_GUARD_BLOCKED_NETWORK: ${hostname}`);
  error.code = "ENETUNREACH";
  process.stderr.write(`${error.message}\n`);
  throw error;
}

for (const client of [http, https]) {
  const request = client.request;
  client.request = function (...args) {
    assertLocal(destinationFrom(args));
    return request.apply(this, args);
  };
}

const connect = net.Socket.prototype.connect;
net.Socket.prototype.connect = function (...args) {
  const options = typeof args[0] === "object" ? args[0] : args[1];
  const host = options && typeof options === "object" ? String(options.host ?? options.hostname ?? "") : typeof options === "string" ? options : "";
  if (host) assertLocal(host);
  return connect.apply(this, args);
};

const originalFetch = globalThis.fetch;
if (originalFetch) {
  globalThis.fetch = function (input, init) {
    let hostname = "";
    try { hostname = new URL(typeof input === "string" || input instanceof URL ? input : input.url).hostname; } catch {}
    assertLocal(hostname);
    return originalFetch.call(this, input, init);
  };
}
