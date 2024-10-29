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

import CalendarPlus2 from './assets/calendar-plus.svg'
import { AddItemForm } from "./components/form/AddItemForm"

export function AddItemModal({ onAddItem }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit = (values) => {
    onAddItem(values)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex flex-row items-center justify-center h-30px p-4 py-6 rounded-full bg-primary-green transition-colors hover:bg-emerald-600/80"
        >
          <img src={CalendarPlus2} alt="Add register" />
          <span className="primary-text text-sm ml-2 text-slate-100">
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
        <AddItemForm onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  )
}

