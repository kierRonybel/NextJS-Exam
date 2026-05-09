import { generateRequest, initialRequests } from "@/lib/mockData";

describe("generateRequest", () => {
  it("uses the provided id", () => {
    const req = generateRequest("test-id");
    expect(req.id).toBe("test-id");
  });

  it("always sets status to Pending", () => {
    for (let i = 0; i < 20; i++) {
      expect(generateRequest(`r-${i}`).status).toBe("Pending");
    }
  });

  it("returns a valid FarmerRequest shape", () => {
    const req = generateRequest("r-001");
    expect(req).toMatchObject({
      id: expect.any(String),
      farmerName: expect.any(String),
      produce: expect.any(String),
      quantity: expect.any(Number),
      unit: expect.any(String),
      status: "Pending",
      timestamp: expect.any(String),
    });
  });

  it("quantity is always a positive integer between 10 and 500", () => {
    for (let i = 0; i < 50; i++) {
      const { quantity } = generateRequest(`r-${i}`);
      expect(quantity).toBeGreaterThanOrEqual(10);
      expect(quantity).toBeLessThanOrEqual(500);
      expect(Number.isInteger(quantity)).toBe(true);
    }
  });

  it("timestamp is a valid ISO 8601 string", () => {
    const { timestamp } = generateRequest("r-ts");
    expect(new Date(timestamp).toISOString()).toBe(timestamp);
  });

  it("farmerName is never empty", () => {
    for (let i = 0; i < 10; i++) {
      expect(generateRequest(`r-${i}`).farmerName.length).toBeGreaterThan(0);
    }
  });
});

describe("initialRequests", () => {
  it("contains 5 seed requests", () => {
    expect(initialRequests).toHaveLength(5);
  });

  it("has a mix of Pending and Accepted statuses", () => {
    const statuses = initialRequests.map((r) => r.status);
    expect(statuses).toContain("Pending");
    expect(statuses).toContain("Accepted");
  });

  it("every request has a unique id", () => {
    const ids = initialRequests.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("all requests have the required fields populated", () => {
    for (const req of initialRequests) {
      expect(req.id).toBeTruthy();
      expect(req.farmerName).toBeTruthy();
      expect(req.produce).toBeTruthy();
      expect(req.quantity).toBeGreaterThan(0);
      expect(req.unit).toBeTruthy();
      expect(req.timestamp).toBeTruthy();
    }
  });
});
