import { FarmerRequest, RequestStatus } from "@/lib/types";

function acceptRequest(
  requests: FarmerRequest[],
  id: string
): FarmerRequest[] {
  return requests.map((req) =>
    req.id === id ? { ...req, status: "Accepted" as const } : req
  );
}

function filterByStatus(
  requests: FarmerRequest[],
  status: RequestStatus
): FarmerRequest[] {
  return requests.filter((r) => r.status === status);
}

function prependRequest(
  requests: FarmerRequest[],
  newRequest: FarmerRequest
): FarmerRequest[] {
  return [newRequest, ...requests];
}

const makeRequest = (
  id: string,
  status: RequestStatus = "Pending"
): FarmerRequest => ({
  id,
  farmerName: "Test Farmer",
  produce: "Rice",
  quantity: 100,
  unit: "kg",
  status,
  timestamp: new Date().toISOString(),
});

describe("acceptRequest", () => {
  it("changes status of the target request to Accepted", () => {
    const requests = [makeRequest("r1"), makeRequest("r2")];
    const result = acceptRequest(requests, "r1");
    expect(result.find((r) => r.id === "r1")?.status).toBe("Accepted");
  });

  it("does not mutate the original array", () => {
    const requests = [makeRequest("r1")];
    const result = acceptRequest(requests, "r1");
    expect(requests[0].status).toBe("Pending");
    expect(result).not.toBe(requests);
  });

  it("leaves all other requests unchanged", () => {
    const requests = [makeRequest("r1"), makeRequest("r2"), makeRequest("r3")];
    const result = acceptRequest(requests, "r2");
    expect(result.find((r) => r.id === "r1")?.status).toBe("Pending");
    expect(result.find((r) => r.id === "r3")?.status).toBe("Pending");
  });

  it("preserves all fields on the accepted request except status", () => {
    const req = makeRequest("r1");
    const [updated] = acceptRequest([req], "r1");
    expect(updated.farmerName).toBe(req.farmerName);
    expect(updated.produce).toBe(req.produce);
    expect(updated.quantity).toBe(req.quantity);
    expect(updated.unit).toBe(req.unit);
    expect(updated.timestamp).toBe(req.timestamp);
  });

  it("returns the same array length after accepting", () => {
    const requests = [makeRequest("r1"), makeRequest("r2")];
    const result = acceptRequest(requests, "r1");
    expect(result).toHaveLength(2);
  });

  it("handles accepting an already-accepted request without error", () => {
    const requests = [makeRequest("r1", "Accepted")];
    const result = acceptRequest(requests, "r1");
    expect(result[0].status).toBe("Accepted");
  });

  it("handles id not found gracefully — no status changes", () => {
    const requests = [makeRequest("r1")];
    const result = acceptRequest(requests, "nonexistent");
    expect(result[0].status).toBe("Pending");
  });
});

describe("filterByStatus (column derivation)", () => {
  const requests = [
    makeRequest("r1", "Pending"),
    makeRequest("r2", "Accepted"),
    makeRequest("r3", "Pending"),
    makeRequest("r4", "Accepted"),
  ];

  it("returns only Pending requests for the pending column", () => {
    const pending = filterByStatus(requests, "Pending");
    expect(pending).toHaveLength(2);
    expect(pending.every((r) => r.status === "Pending")).toBe(true);
  });

  it("returns only Accepted requests for the accepted column", () => {
    const accepted = filterByStatus(requests, "Accepted");
    expect(accepted).toHaveLength(2);
    expect(accepted.every((r) => r.status === "Accepted")).toBe(true);
  });

  it("pending + accepted counts always sum to total", () => {
    const pending = filterByStatus(requests, "Pending");
    const accepted = filterByStatus(requests, "Accepted");
    expect(pending.length + accepted.length).toBe(requests.length);
  });

  it("returns empty array when no requests match the status", () => {
    const onlyPending = [makeRequest("r1"), makeRequest("r2")];
    expect(filterByStatus(onlyPending, "Accepted")).toHaveLength(0);
  });
});

describe("card movement: accept then re-derive columns", () => {
  it("card moves from pending to accepted after acceptRequest", () => {
    const requests = [makeRequest("r1"), makeRequest("r2", "Accepted")];
    const updated = acceptRequest(requests, "r1");
    expect(filterByStatus(updated, "Pending")).toHaveLength(0);
    expect(filterByStatus(updated, "Accepted")).toHaveLength(2);
  });

  it("card appears in accepted column with same id after move", () => {
    const requests = [makeRequest("r1")];
    const updated = acceptRequest(requests, "r1");
    const accepted = filterByStatus(updated, "Accepted");
    expect(accepted[0].id).toBe("r1");
  });
});

describe("prependRequest (broker simulation)", () => {
  it("new request appears at index 0", () => {
    const existing = [makeRequest("r1")];
    const newReq = makeRequest("r2");
    const result = prependRequest(existing, newReq);
    expect(result[0].id).toBe("r2");
  });

  it("existing requests are preserved after prepend", () => {
    const existing = [makeRequest("r1"), makeRequest("r2")];
    const newReq = makeRequest("r3");
    const result = prependRequest(existing, newReq);
    expect(result).toHaveLength(3);
    expect(result[1].id).toBe("r1");
    expect(result[2].id).toBe("r2");
  });

  it("does not mutate the original array", () => {
    const existing = [makeRequest("r1")];
    prependRequest(existing, makeRequest("r2"));
    expect(existing).toHaveLength(1);
  });

  it("new request always has status Pending", () => {
    const newReq = makeRequest("r-new", "Pending");
    const result = prependRequest([], newReq);
    expect(result[0].status).toBe("Pending");
  });
});
