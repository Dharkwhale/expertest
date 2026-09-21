import { describe, expect, it } from "vitest";
import { readViewState } from "./view-state";

describe("readViewState", () => {
  it("returns the three allow-listed review states", () => {
    expect(readViewState({ state: "loading" })).toBe("loading");
    expect(readViewState({ state: "error" })).toBe("error");
    expect(readViewState({ state: "empty" })).toBe("empty");
  });

  it("falls back to ready for anything else", () => {
    expect(readViewState({})).toBe("ready");
    expect(readViewState({ state: "ready" })).toBe("ready");
    expect(readViewState({ state: "<script>" })).toBe("ready");
    expect(readViewState({ state: "LOADING" })).toBe("ready");
  });

  it("uses the first value when the param repeats (?state=a&state=b)", () => {
    expect(readViewState({ state: ["error", "loading"] })).toBe("error");
  });
});
