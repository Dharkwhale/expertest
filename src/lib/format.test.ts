import { describe, expect, it } from "vitest";
import { formatCompact, formatCount, formatNgn } from "./format";

describe("format", () => {
  it("groups thousands for counts (ex3 '1,240 people going')", () => {
    expect(formatCount(1240)).toBe("1,240");
    expect(formatCount(0)).toBe("0");
  });

  it("compacts large counts to one decimal (ex7 '1.2K going')", () => {
    expect(formatCompact(1240)).toBe("1.2K");
    expect(formatCompact(640)).toBe("640");
  });

  it("formats naira with the ₦ sign and grouping", () => {
    expect(formatNgn(25000)).toBe("₦25,000");
    expect(formatNgn(85000)).toBe("₦85,000");
  });
});
