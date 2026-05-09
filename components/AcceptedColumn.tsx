"use client";

import { FarmerRequest } from "@/lib/types";
import RequestCard from "./RequestCard";

interface AcceptedColumnProps {
  requests: FarmerRequest[];
}

export default function AcceptedColumn({ requests }: AcceptedColumnProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <h2 className="font-semibold text-gray-800">Accepted</h2>
        </div>
        <span className="text-xs font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded">
          {requests.length}
        </span>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[70vh]">
        {requests.length === 0 ? (
          <p className="text-sm text-gray-400 py-10 text-center">
            No accepted requests
          </p>
        ) : (
          requests.map((req) => <RequestCard key={req.id} request={req} />)
        )}
      </div>
    </div>
  );
}
