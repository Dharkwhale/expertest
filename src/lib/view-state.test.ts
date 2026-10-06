import { afterEach, describe, expect, it, vi } from "vitest";
import { readDeclineSwitch, readViewState, reviewSwitchEnabled } from "./view-state";

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

// GAP-008: the switch is a review affordance and must do nothing in a production build
describe("the review switch in production", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is enabled outside production", () => {
    expect(reviewSwitchEnabled()).toBe(true);
  });

  it("ignores every forced state once NODE_ENV is production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(reviewSwitchEnabled()).toBe(false);
    expect(readViewState({ state: "loading" })).toBe("ready");
    expect(readViewState({ state: "error" })).toBe("ready");
    expect(readViewState({ state: "empty" })).toBe("ready");
    expect(readViewState({ state: ["error", "loading"] })).toBe("ready");
  });
});

describe("readDeclineSwitch", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("is on only for ?state=declined", () => {
    expect(readDeclineSwitch({ state: "declined" })).toBe(true);
    expect(readDeclineSwitch({ state: "loading" })).toBe(false);
    expect(readDeclineSwitch({})).toBe(false);
  });

  it("is off in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(readDeclineSwitch({ state: "declined" })).toBe(false);
  });
});
