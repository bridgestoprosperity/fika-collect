import { GET as healthcheck } from '../../../../api/healthcheck.js';
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("healthcheck", () => {
  it("returns a successful healthcheck response", async () => {
    const request = new Request("http://localhost/api/v1/healthcheck", {
      method: "GET",
    });

    const response = await healthcheck(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body).toEqual({ status: "ok" });
  });
});
