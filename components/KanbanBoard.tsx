"use client";

import { useEffect, useState, useCallback } from "react";
import { FarmerRequest } from "@/lib/types";
import { initialRequests, generateRequest } from "@/lib/mockData";
import { generateId } from "@/lib/utils";
import PendingColumn from "./PendingColumn";
import AcceptedColumn from "./AcceptedColumn";

const SIMULATION_INTERVAL_MS = 5000;

export default function KanbanBoard() {
  const [requests, setRequests] = useState<FarmerRequest[]>(initialRequests);
  const [notification, setNotification] = useState<string | null>(null);

  const acceptRequest = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: "Accepted" as const,
              acceptedAt: new Date().toISOString(),
            }
          : req,
      ),
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = generateId();
      const newRequest = generateRequest(id);
      setRequests((prev) => [newRequest, ...prev]);

      setNotification(newRequest.farmerName);
      setTimeout(() => setNotification(null), 3000);
    }, SIMULATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const pending = requests.filter((r) => r.status === "Pending");
  const accepted = requests
    .filter((r) => r.status === "Accepted")
    .sort((a, b) => (b.acceptedAt ?? "").localeCompare(a.acceptedAt ?? ""));

  return (
    <div>
      {notification && (
        <div className="fixed top-4 right-4 z-50 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-md text-sm text-gray-700">
          New request from{" "}
          <span className="font-semibold text-gray-900">{notification}</span>{" "}
          received
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <PendingColumn requests={pending} onAccept={acceptRequest} />
        <AcceptedColumn requests={accepted} />
      </div>
    </div>
  );
}
