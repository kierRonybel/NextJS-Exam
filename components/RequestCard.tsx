"use client";

import { FarmerRequest } from "@/lib/types";
import { formatTimestamp } from "@/lib/utils";

interface RequestCardProps {
  request: FarmerRequest;
  onAccept?: (id: string) => void;
}

export default function RequestCard({ request, onAccept }: RequestCardProps) {
  const isPending = request.status === "Pending";

  return (
    <div className={`rounded-lg p-4 bg-white border border-gray-200 border-l-4 ${isPending ? "border-l-orange-400" : "border-l-green-500"}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-gray-800 text-sm">{request.farmerName}</p>
        <span className="text-xs text-gray-400">{request.id}</span>
      </div>

      <p className="text-sm text-gray-700">{request.produce}</p>
      <p className="text-sm text-gray-500">
        <span className="text-xs text-gray-400 uppercase tracking-wide mr-1">Qty</span>
        {request.quantity} {request.unit}
      </p>
      <p className="text-xs text-gray-400 mt-1 mb-3" suppressHydrationWarning>{formatTimestamp(request.timestamp)}</p>

      {isPending && onAccept ? (
        <button
          onClick={() => onAccept(request.id)}
          className="w-full py-1.5 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700"
        >
          Accept Request
        </button>
      ) : (
        <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">Accepted</span>
      )}
    </div>
  );
}
