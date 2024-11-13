import { useEffect, useState, useMemo, useCallback, Fragment } from "react"

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

import { Trash, Download, SlidersHorizontal, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"

import { myCustomFilterFn } from "./columns"
import { toast } from "sonner"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { AddItemModal } from "@/AddItemModal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import * as XLSX from 'xlsx';

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

  const fetchVisitors = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/visitors')
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
  }, [])

  useEffect(() => {
    fetchVisitors()
  }, [fetchVisitors])

  const handleAddItem = async (newItem) => {
    const itemWithRegisteredBy = {
      ...newItem
    }
    try {
      const response = await fetch('http://localhost:3001/api/visitors', {
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
      const response = await fetch('http://localhost:3001/api/visitors', {
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
      const response = await fetch(`http://localhost:3001/api/visitors/${id}`, {
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

  const refreshData = () => {
    fetchVisitors();
  };

  const [columnVisibility, setColumnVisibility] = useState({})
  const [expanded, setExpanded] = useState({})

  const columnLabels = {
    fullName: "Nombre Completo",
    dni: "Cédula",
    company: "Empresa",
    phone: "Teléfono",
    entity: "Entidad",
    gerency: "Gerencia",
    direction: "Dirección",
    area: "Área",
    entryDateTime: "Fecha de Entrada",
    exitDate: "Fecha de Salida",
    visitType: "Tipo de Visita"
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
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      rowSelection,
      globalFilter,
      columnVisibility,
    },
    meta: {
      deleteVisitor: (id) => deleteVisitor(id),
      refreshData: fetchVisitors,
    },
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-full h-16 bg-gray-200 animate-pulse rounded-md" />
        ))}
      </div>
    )
  }

  const exportToExcel = () => {
    // Define clean header names mapping
    const headerMapping = {
      fullName: "Nombre Completo",
      dni: "Cédula",
      company: "Empresa",
      phone: "Teléfono",
      entity: "Entidad",
      gerency: "Gerencia",
      direction: "Dirección",
      area: "Área",
      entryDateTime: "Fecha de Entrada",
      exitDate: "Fecha de Salida",
      visitType: "Tipo de Visita"
    }

    // Get visible columns
    const visibleCols = table.getVisibleFlatColumns()
      .filter(col => !['select', 'actions'].includes(col.id)) // Exclude select and actions columns

    // Create data with clean headers
    const data = table.getRowModel().rows.map(row =>
      visibleCols.reduce((acc, col) => {
        let value = row.getValue(col.id)

        // Special handling for formatted dates
        if (col.id === 'entryDateTime') {
          const dateStr = row.original.visitDate
          const timeStr = row.original.visitHour
          if (dateStr && timeStr) {
            const date = new Date(dateStr)
            const time = new Date(timeStr)
            value = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              time.getHours(),
              time.getMinutes(),
              time.getSeconds()
            ).toLocaleString()
          }
        } else if (col.id === 'exitDate' && value) {
          value = new Date(value).toLocaleString()
        }

        // Use mapped header name or fallback to column ID
        acc[headerMapping[col.id] || col.id] = value
        return acc
      }, {})
    )

    // Create worksheet with clean data
    const ws = XLSX.utils.json_to_sheet(data)

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Visitors")

    // Save file
    XLSX.writeFile(wb, "visitors.xlsx")
  }

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      {/* Stats Cards with horizontal scroll */}


      {/* Controls Section */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between p-4 navbar-gradient border border-[var(--primary-blue)]">
        <Input
          placeholder='Filtrar por...'
          value={globalFilter ?? ''}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className='w-full sm:max-w-xs bg-white'
        />
        <div className="flex flex-wrap gap-2 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="whitespace-nowrap bg-white hover:bg-[var(--primary-blue)] hover:text-white transition-colors duration-200"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline primary-text">Columnas</span>
                <span className="sm:hidden primary-text">Col</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table.getAllColumns()
                .filter(column => column.getCanHide() && columnLabels[column.id])
                .map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {columnLabels[column.id] || column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={exportToExcel}
            variant="outline"
            className="whitespace-nowrap bg-white hover:bg-[var(--primary-blue)] hover:text-white transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline primary-text">Exportar</span>
            <span className="sm:hidden primary-text">Exp</span>
          </Button>

          <AddItemModal refreshData={refreshData} />

          {isAdmin && (
            <Button
              variant="destructive"
              className="whitespace-nowrap"
              onClick={handleDeleteSelected}
              disabled={Object.keys(rowSelection).length === 0}
            >
              <Trash className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline primary-text">Borrar seleccionados</span>
              <span className="sm:hidden primary-text">Borrar</span>
            </Button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="border rounded-md bg-[var(--primary-blue)]">
        <ScrollArea className="w-full whitespace-nowrap">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-[var(--primary-blue)] hover:bg-[var(--primary-blue)]/90">
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
                    className="transition-colors hover:bg-[var(--secondary-blue)]/10 bg-white"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="bg-white">
                  <TableCell
                    colSpan={visibleColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Updated Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t bg-[var(--primary-blue)] text-white">
          {isAdmin && (
            <div className="text-sm mb-4 sm:mb-0">
              {table.getFilteredSelectedRowModel().rows.length} de{' '}
              {table.getFilteredRowModel().rows.length} registros seleccionados.
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="bg-white hover:bg-[var(--primary-blue)] hover:text-white transition-colors duration-200"
            >
              <ChevronLeft className="h-4 w-4 text-black" />
            </Button>
            <div className="text-sm">
              Página {table.getState().pagination.pageIndex + 1} de{' '}
              {table.getPageCount()}
            </div>
            <Button
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="bg-white hover:bg-[var(--primary-blue)] hover:text-white transition-colors duration-200"
            >
              <ChevronRight className="h-4 w-4 text-black" />
            </Button>
          </div>
        </div>
      </div>
    </div >
  )
}