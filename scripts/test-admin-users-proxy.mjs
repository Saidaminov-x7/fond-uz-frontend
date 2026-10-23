import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import ts from "typescript";

// Run the actual route with only its upstream transport replaced.
const source = readFileSync(new URL("../src/app/api/admin/[...path]/route.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const calls = [];
const route = {};
new Function("require", "exports", compiled)(() => ({ adminApi: async (...args) => {
  calls.push(args);
  return Response.json({ items: [] });
} }), route);
const invoke = (method, path, query = "") => route[method](new Request(`http://localhost/api/admin/${path.join("/")}${query}`, { method }), { params: Promise.resolve({ path }) });

test("users collection remains readable, forwarding pagination only", async () => {
  calls.length = 0;
  assert.equal((await invoke("GET", ["users"], "?limit=2&offset=1&unused=x")).status, 200);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "/api/users/all?limit=2&offset=1");
});

test("unsupported user mutations and identifiers never reach upstream", async () => {
  calls.length = 0;
  for (const method of ["POST", "PATCH", "DELETE"]) {
    for (const path of [["users"], ["users", "example-id"]]) {
      const response = await invoke(method, path);
      assert.equal(response.status, 405);
      assert.equal(response.headers.get("allow"), "GET");
    }
  }
  assert.equal((await invoke("GET", ["users", "example-id"])).status, 404);
  assert.equal((await invoke("GET", ["users"], "?id=example-id")).status, 404);
  assert.equal((await invoke("GET", ["users"], "?id=")).status, 404);
  assert.equal(calls.length, 0);
});

test("content mutation routing remains unchanged", async () => {
  calls.length = 0;
  await invoke("PATCH", ["doctors", "example-id"]);
  assert.equal(calls[0][0], "/api/doctors/example-id");
  assert.equal(calls[0][1].method, "PATCH");
});
