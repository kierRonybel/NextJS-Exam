import { Suspense } from "react";
import KanbanBoard from "@/components/KanbanBoard";

function KanbanSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {[0, 1].map((col) => (
        <div key={col}>
          <div className="h-6 w-24 bg-gray-200 rounded mb-4 animate-pulse" />
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Request Pipeline</h2>
        <p className="text-sm text-gray-500 mt-1">
          New requests arrive every 5 seconds. Click &quot;Accept Request&quot; to move them to the accepted column.
        </p>
      </div>
      <Suspense fallback={<KanbanSkeleton />}>
        <KanbanBoard />
      </Suspense>
    </div>
  );
}
