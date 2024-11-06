import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DataTable } from "./data-table"
import { columns } from "./columns"
import { VisitsDashboard } from "@/components/VisitsDashboard"

export function VisitsPage({ user }) {
  const [showDashboard, setShowDashboard] = useState(true);
  const [visitData, setVisitData] = useState([]);

  // ... existing fetch logic ...

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Registro de Visitas</h1>
        <Button
          onClick={() => setShowDashboard(!showDashboard)}
          variant="outline"
        >
          {showDashboard ? "Ocultar Dashboard" : "Mostrar Dashboard"}
        </Button>
      </div>

      {showDashboard && (
        <div className="mb-6">
          <VisitsDashboard data={visitData} />
        </div>
      )}

      <DataTable columns={columns} user={user} />
    </div>
  )
}
