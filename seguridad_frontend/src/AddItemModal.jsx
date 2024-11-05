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
            variant="outline"
            className="flex flex-row items-center justify-center h-10 px-4 rounded-full bg-primary-green transition-colors hover:bg-emerald-600/80"
          >
            <img src={CalendarPlus2} alt="Add register" className="mr-2" />
            <span className="primary-text text-sm text-slate-100">
              Registrar entrada
            </span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Añadir nuevo registro</DialogTitle>
            <DialogDescription>
              Siga los pasos para registrar una nueva entrada.
            </DialogDescription>
            <hr className="my-4 border-gray-200" />
          </DialogHeader>
          <AddItemForm onSubmitSuccess={handleSubmitSuccess} />
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

