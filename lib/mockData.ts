import { FarmerRequest } from "./types";

const farmerNames = [
  "Carlos Mendoza",
  "Lina Reyes",
  "Amara Osei",
  "Priya Nair",
  "Tomás Herrera",
  "Fatima Al-Rashid",
  "James Okonkwo",
  "Sofia Petrov",
];

const produceTypes = [
  { name: "Organic Rice", unit: "kg" },
  { name: "Sweet Corn", unit: "crates" },
  { name: "Cherry Tomatoes", unit: "kg" },
  { name: "Fresh Spinach", unit: "bundles" },
  { name: "Mango", unit: "kg" },
  { name: "Cassava", unit: "bags" },
  { name: "Wheat", unit: "tonnes" },
  { name: "Soybeans", unit: "kg" },
  { name: "Sugarcane", unit: "tonnes" },
  { name: "Pepper", unit: "kg" },
];

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRequest(id: string): FarmerRequest {
  const produce = randomItem(produceTypes);
  return {
    id,
    farmerName: randomItem(farmerNames),
    produce: produce.name,
    quantity: randomBetween(10, 500),
    unit: produce.unit,
    status: "Pending",
    timestamp: new Date().toISOString(),
  };
}

export const initialRequests: FarmerRequest[] = [
  {
    id: "req-001",
    farmerName: "Carlos Mendoza",
    produce: "Organic Rice",
    quantity: 250,
    unit: "kg",
    status: "Pending",
    timestamp: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: "req-002",
    farmerName: "Lina Reyes",
    produce: "Cherry Tomatoes",
    quantity: 80,
    unit: "kg",
    status: "Pending",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: "req-003",
    farmerName: "Amara Osei",
    produce: "Cassava",
    quantity: 12,
    unit: "bags",
    status: "Accepted",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: "req-004",
    farmerName: "James Okonkwo",
    produce: "Sweet Corn",
    quantity: 45,
    unit: "crates",
    status: "Pending",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: "req-005",
    farmerName: "Sofia Petrov",
    produce: "Wheat",
    quantity: 3,
    unit: "tonnes",
    status: "Accepted",
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
];
