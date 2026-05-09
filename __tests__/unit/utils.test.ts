import { formatTimestamp, generateId } from "@/lib/utils";

describe("formatTimestamp", () => {
  it("returns 'just now' for timestamps less than 1 minute ago", () => {
    const ts = new Date(Date.now() - 30 * 1000).toISOString();
    expect(formatTimestamp(ts)).toBe("just now");
  });

  it("returns 'Xm ago' for timestamps within the past hour", () => {
    const ts = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatTimestamp(ts)).toBe("5m ago");
  });

  it("returns 'Xh ago' for timestamps within the past 24 hours", () => {
    const ts = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(formatTimestamp(ts)).toBe("3h ago");
  });

  it("returns a locale date string for timestamps older than 24 hours", () => {
    const old = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const ts = old.toISOString();
    expect(formatTimestamp(ts)).toBe(old.toLocaleDateString());
  });
});

describe("generateId", () => {
  it("returns a string with format req-XXX", () => {
    const id = generateId();
    expect(id).toMatch(/^req-\d+$/);
  });

  it("returns a different id on each call", () => {
    const a = generateId();
    const b = generateId();
    expect(a).not.toBe(b);
  });

  it("ids are monotonically increasing", () => {
    const a = parseInt(generateId().replace("req-", ""), 10);
    const b = parseInt(generateId().replace("req-", ""), 10);
    expect(b).toBeGreaterThan(a);
  });
});
