import { MoreHorizontal, ArrowUpDown, Clock, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

export const myCustomFilterFn = (row, id, filterValue) => {
  const lowerFilterValue = filterValue.toLowerCase();
  const filterParts = lowerFilterValue.split(' ');

  // Create a flat object with all the searchable values
  const searchableValues = {
    fullName: row.original.visitor?.fullName,
    dni: `${row.original.visitor?.dniType}-${row.original.visitor?.dniNumber}`,
    company: row.original.visitor?.company?.name,
    companyRif: row.original.visitor?.company?.rif,
    phone: row.original.visitor?.contactNumber,
    entity: row.original.location?.entity,
    gerency: row.original.location?.administrativeUnit,
    direction: row.original.location?.direction,
    area: row.original.location?.area,
    visitType: row.original.visitType === 'Pedestrian' ? 'Peatonal' : 'Vehicular',
  };

  // Convert all values to a single searchable string
  const rowValues = Object.values(searchableValues)
    .filter(Boolean) // Remove null/undefined values
    .join(' ')
    .toLowerCase();

  // Check if all filter parts are included in the searchable string
  return filterParts.every((part) => rowValues.includes(part));
};

const handleExit = async (visitId, table) => {
  try {
    const response = await fetch(`http://localhost:3001/api/visitors/exit/${visitId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
    });

    if (response.ok) {
      toast.success('Salida registrada exitosamente');
      table.options.meta?.refreshData();
    } else {
      toast.error('Error al registrar la salida');
    }
  } catch (error) {
    console.error('Error marking visit exit:', error);
    toast.error('Error al registrar la salida');
  }
};

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "fullName",
    accessorKey: "visitor.fullName",
    accessorFn: (row) => row.visitor?.fullName ?? 'N/A',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nombre Completo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "dni",
    accessorFn: (row) => {
      const dniType = row.visitor?.dniType;
      const dniNumber = row.visitor?.dniNumber;
      return dniType && dniNumber ? `${dniType}-${dniNumber}` : 'N/A';
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cédula
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "company",
    accessorFn: (row) => row.visitor?.company?.name ?? 'N/A',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Empresa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "companyRif",
    accessorFn: (row) => row.visitor?.company?.rif ?? 'N/A',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Empresa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "phone",
    accessorFn: (row) => row.visitor?.contactNumber ?? 'N/A',
    header: "Teléfono",
  },
  {
    id: "entity",
    accessorFn: (row) => row.location?.entity ?? 'N/A',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Entidad
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "gerency",
    accessorFn: (row) => row.location?.administrativeUnit ?? 'N/A',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Gerencia
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "direction",
    accessorFn: (row) => row.location?.direction ?? 'N/A',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Dirección
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "area",
    accessorFn: (row) => row.location?.area ?? 'N/A',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Área
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "entryDateTime",
    accessorFn: (row) => {
      const dateStr = row.visitDate;
      const timeStr = row.visitHour;
      if (!dateStr || !timeStr) return null;

      const date = new Date(dateStr);
      const time = new Date(timeStr);

      // Combine date and time
      const combined = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
      );

      return combined.getTime(); // for sorting
    },
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha de Entrada
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const dateStr = row.original.visitDate;
      const timeStr = row.original.visitHour;
      if (!dateStr || !timeStr) return 'N/A';

      const date = new Date(dateStr);
      const time = new Date(timeStr);

      const combined = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes(),
        time.getSeconds()
      );

      return combined.toLocaleString();
    },
  },
  {
    id: "exitDate",
    accessorKey: "exitDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha de Salida
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const exitDate = row.original.exitDate;
      return exitDate ? new Date(exitDate).toLocaleString() : 'Pendiente';
    },
  },
  {
    id: "visitType",
    accessorFn: (row) => row.visitType === 'Pedestrian' ? 'Peatonal' : 'Vehicular',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tipo de Visita
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const visit = row.original
      const hasExitDate = Boolean(visit.exitDate)

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {!hasExitDate && (
              <DropdownMenuItem
                onClick={() => handleExit(visit.id, table)}
              >
                <Clock className="mr-2 h-4 w-4" />
                <span>Marcar salida</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => table.options.meta?.deleteVisitor(visit.id)}
              className="text-red-600"
            >
              <Trash className="mr-2 h-4 w-4" />
              <span>Borrar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]