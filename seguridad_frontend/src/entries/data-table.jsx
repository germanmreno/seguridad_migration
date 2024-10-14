import { useEffect, useState, useMemo } from "react"

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { AddItemModal } from "@/AddItemModal"
import { Trash } from "lucide-react"

import { columns, myCustomFilterFn } from "./columns"
import { toast } from "sonner"

export function DataTable({ columns, user }) {

  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  const [dataVisitors, setDataVisitors] = useState([])
  const [loading, setLoading] = useState(true)

  const isAdmin = useMemo(() => user?.role === 'ADMIN', [user])

  const visibleColumns = useMemo(() => {
    if (isAdmin) {
      return columns
    } else {
      return columns.filter(column => column.id !== 'select' && column.id !== 'actions' && column.id !== 'registered_by')
    }
  }, [columns, isAdmin])

  useEffect(() => {
    fetchVisitors()
  }, [])

  const fetchVisitors = async () => {
    try {
      const response = await fetch('http://172.16.2.51:3001/api/visitors')
      if (response.ok) {
        const visitors = await response.json()
        setDataVisitors(visitors)
        console.log(visitors)
      } else {
        console.error('Error fetching visitors:', await response.text())
      }
    } catch (error) {
      console.error('Error fetching visitors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = async (newItem) => {
    const itemWithRegisteredBy = {
      ...newItem
    }
    try {
      const response = await fetch('http://172.16.2.51:3001/api/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add this line
        },
        body: JSON.stringify(itemWithRegisteredBy),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Visitor created:', result)
        toast.success('Registro creado correctamente')
        fetchVisitors() // Refresh the data after adding a new visitor
      } else {
        console.error('Error creating visitor:', await response.text())
        toast.error('Error creando registro')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Error creando registro')
    }
  }

  const deleteVisitors = async (ids) => {
    try {
      const response = await fetch('http://172.16.2.51:3001/api/visitors', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add this line
        },
        body: JSON.stringify({ ids }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log(result.message)
        fetchVisitors() // Refresh the data after deletion
        setRowSelection({}) // Clear row selection
      } else {
        console.error('Error deleting visitors:', await response.text())
      }
    } catch (error) {
      console.error('Error deleting visitors:', error)
    }
  }

  const deleteVisitor = async (id) => {
    try {
      const response = await fetch(`http://172.16.2.51:3001/api/visitors/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add this line
        },
      })

      if (response.ok) {
        console.log(`Visitor with ID ${id} deleted successfully`)
        fetchVisitors() // Refresh the data after deletion
      } else {
        console.error('Error deleting visitor:', await response.text())
      }
    } catch (error) {
      console.error('Error deleting visitor:', error)
    }
  }

  const handleDeleteSelected = () => {
    const selectedIds = Object.keys(rowSelection).map(index => dataVisitors[parseInt(index, 10)].id)
    if (selectedIds.length > 0) {
      deleteVisitors(selectedIds)
    }
  }

  const table = useReactTable({
    data: dataVisitors,
    columns: visibleColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: myCustomFilterFn,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
    },
    meta: {
      deleteVisitor: (id) => deleteVisitor(id),
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between py-4 px-4 bg-gray-200/90 border-2 mt-[-5px] mb-[-1px] border-solid border-gray">
        <div className="flex flex-row">
          <Input
            placeholder='Filtrar por...'
            value={globalFilter ?? ''}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className='max-w-sm bg-white '
          />
        </div>

        <div className="flex space-x-2">
          {isAdmin && (
            <Button
              variant="destructive"
              className="h-auto rounded-full primary-text font-bold"
              onClick={handleDeleteSelected}
              disabled={Object.keys(rowSelection).length === 0}
            >
              <Trash className="mr-2" />
              Borrar seleccionados
            </Button>
          )}
          <AddItemModal onAddItem={handleAddItem} />
        </div>
      </div>

      <div className="rounded-md border-solid border-2 border-gray">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={visibleColumns.length} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className='space-x-2 py-4 px-2 flex justify-between items-center footer-foreground'>
          {isAdmin && (
            <div className='flex-1 text-sm text-white'>
              {table.getFilteredSelectedRowModel().rows.length} de{' '}
              {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
            </div>
          )}

          <div className='flex items-center justify-end space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Anterior
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}