import { describe, expect, it } from "vitest";
import { isActive } from "./nav-items";

describe("isActive", () => {
  it("matches the tab's own route", () => {
    expect(isActive("/live", "/live")).toBe(true);
  });

  it("keeps a tab lit on its nested routes", () => {
    expect(isActive("/live/squad", "/live")).toBe(true);
  });

  it("does not match a route that merely shares a prefix", () => {
    expect(isActive("/lively", "/live")).toBe(false);
    expect(isActive("/home", "/live")).toBe(false);
  });
});
