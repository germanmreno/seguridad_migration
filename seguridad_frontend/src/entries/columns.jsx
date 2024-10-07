// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

import { MoreHorizontal } from "lucide-react"
import { ArrowUp, ArrowDown } from 'lucide-react';


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

const myCustomFilterFn = (row, columnId, filterValue) => {
  const lowerFilterValue = filterValue.toLowerCase();
  const filterParts = lowerFilterValue.split(' ');

  let rowValues = Object.values(row.original).join(' ').toLowerCase();

  // Include office names in the rowValues
  if (row.original.offices && Array.isArray(row.original.offices)) {
    const officeNames = row.original.offices.map(office => office.office.name.toLowerCase()).join(' ');
    rowValues += ' ' + officeNames;
  }

  // Replace "en revision" with "pending"
  const statusReplacements = {
    "en": "pending",
    "proceso": "pending",
    "finalizado": "completed",
    "EN": "pending",
    "PROCESO": "pending",
    "FINALIZADO": "completed"
  };

  const modifiedFilterParts = filterParts.map(part => {
    return statusReplacements[part] || part;
  });

  return modifiedFilterParts.every((part) => rowValues.includes(part));
};

const SortedIcon = ({ isSorted = "asc" }) => {
  if (isSorted === 'asc') {
    return <ArrowUp className='h-4 w-4' />;
  } else if (isSorted === 'desc') {
    return <ArrowDown className='h-4 w-4' />;
  } else {
    return null;
  }
};

export const columns = ({ navigate, toast, setRefresh }) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        className="bg-white"
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Seleccionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        className="bg-white"
        aria-label="Seleccionar fila"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "nombres",
    header: "Nombres",
  },
  {
    accessorKey: "ci",
    header: "Cédula de identidad",
  },
  {
    accessorKey: "empresa",
    header: "Empresa",
  },
  {
    accessorKey: "telefono",
    header: "Teléfono",
  },
  {
    accessorKey: "diaentrada",
    header: "Fecha de entrada",
  },
  {
    accessorKey: "direccion",
    header: "Dirección",
  },
  {
    accessorKey: "contacto",
    header: "Contacto",
  },
  {
    accessorKey: "observaciones",
    header: "Observaciones",
  },
  {
    accessorKey: "carnet",
    header: "Carnet",
  },
  // {
  //   id: "actions",
  //   header: "Acciones",
  //   cell: ({ row }) => {

  //     const id = row.getValue("id");
  //     const status = row.getValue("status");

  //     const handleChangeStatus = async () => {
  //       const newStatus = status === "PENDING" ? "COMPLETED" : "PENDING";
  //       try {
  //         await axios.patch(`http://localhost:3000/memos/${id}/status`, { status: newStatus });
  //         toast.success(`${id}:
  //           Status actualizado a ${(newStatus === "COMPLETED") ? "Finalizado" : "En proceso"
  //           } `);
  //         setRefresh(prev => !prev)
  //       } catch (error) {
  //         toast.error('Error cambiando el status. Contacte a Soporte.');
  //         console.error('Failed to change status:', error);
  //       }
  //     };

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild className="flex justify-center">
  //           <Button variant="ghost " className="h-8 w-8 p-0">
  //             <span className="sr-only">Abrir acciones</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Acciones</DropdownMenuLabel>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem onClick={() => navigate(`/check-forum/${id.toLocaleLowerCase()}`)}>Abrir foro</DropdownMenuItem>
  //           <DropdownMenuItem>Cerrar foro</DropdownMenuItem>
  //           <DropdownMenuItem>Editar foro</DropdownMenuItem>
  //           <DropdownMenuItem onClick={handleChangeStatus}>Cambiar status</DropdownMenuItem>
  //           <DropdownMenuItem>Editar registro</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     )
  //   },
  // },
]