export type RequestStatus = "Pending" | "Accepted";

export interface FarmerRequest {
  id: string;
  farmerName: string;
  produce: string;
  quantity: number;
  unit: string;
  status: RequestStatus;
  timestamp: string;
  acceptedAt?: string;
}
