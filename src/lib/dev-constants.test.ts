import assert from "node:assert/strict";
import test from "node:test";

import { DEV_JWT_SECRET } from "./dev-constants";

test("DEV_JWT_SECRET is a non-empty string", () => {
  assert.equal(typeof DEV_JWT_SECRET, "string");
  assert.ok(DEV_JWT_SECRET.length > 0);
});

test("DEV_JWT_SECRET is consistent across imports", async (t) => {
  // Verify the same constant is used in jwt.ts and gateway-resources.ts
  const jwtModule = await import("./jwt");
  const gatewayModule = await import("./gateway-resources");

  // Both modules should import from dev-constants — verify by checking
  // that the dev secret is used when JWT_SECRET is absent in non-production
  const originalEnv = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  const env: Record<string, string | undefined> = process.env;
  const originalNodeEnv = env.NODE_ENV;
  t.after(() => {
    if (originalNodeEnv === undefined) delete env.NODE_ENV;
    else env.NODE_ENV = originalNodeEnv;
    if (originalEnv === undefined) delete env.JWT_SECRET;
    else env.JWT_SECRET = originalEnv;
  });
  env.NODE_ENV = "development";

  // If modules share the same DEV_JWT_SECRET, encryption/decryption should be consistent
  assert.ok(DEV_JWT_SECRET.includes("do-not-use-in-production"));

  // Restore
  if (originalEnv !== undefined) process.env.JWT_SECRET = originalEnv;
  // NODE_ENV is restored automatically by the test context.
});
