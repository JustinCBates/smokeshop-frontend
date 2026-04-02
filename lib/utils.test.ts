import { describe, expect, it } from "vitest";

import { cn, formatCurrency, slugify } from "./utils";

describe("utils", () => {
  it("formats cents as USD", () => {
    expect(formatCurrency(12345)).toBe("$123.45");
  });

  it("slugifies text for URLs", () => {
    expect(slugify("Hello, World 420")).toBe("hello-world-420");
  });

  it("merges Tailwind classes predictably", () => {
    expect(cn("px-2", "py-1", "px-4")).toBe("py-1 px-4");
  });
});