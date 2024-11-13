import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  AlertDialog, AlertDialogContent, AlertDialogDescription,
  AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog"

import CalendarPlus2 from './assets/calendar-plus.svg'
import { AddItemForm } from "./components/form/AddItemForm"

export function AddItemModal({ refreshData }) {
  const [isOpen, setIsOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSubmitSuccess = () => {
    setIsOpen(false)
    setShowSuccess(true)
    refreshData()

    setTimeout(() => {
      setShowSuccess(false)
    }, 3000)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="flex flex-row items-center justify-center h-10 px-4 bg-[var(--primary-green)] transition-colors hover:bg-[var(--primary-green)]/80"
          >
            <img src={CalendarPlus2} alt="Add register" className="mr-2" />
            <span className="primary-text text-sm text-slate-100">
              Registrar entrada
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-[1200px] min-h-fit max-h-[90vh] p-0 pb-4">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Añadir nuevo registro</DialogTitle>
            <DialogDescription>
              Siga los pasos para registrar una nueva entrada.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-[400px] max-h-[calc(90vh-80px)] overflow-hidden">
            <AddItemForm onSubmitSuccess={handleSubmitSuccess} />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showSuccess} onOpenChange={setShowSuccess}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¡Registro Exitoso!</AlertDialogTitle>
            <AlertDialogDescription>
              El visitante ha sido registrado correctamente en el sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

    </>
  )
}

